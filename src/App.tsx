import React, { useState, useEffect } from 'react';
import { Baby, Calendar, Download, Moon, Sun, Bell, Syringe, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { VACCINATION_SCHEDULE } from './types';
import { calculateAge, getVaccineStatus, getVaccinationDays } from './lib/vaccineUtils';
import { cn } from './lib/utils';

export default function App() {
  const [birthDate, setBirthDate] = useState<string>(() => {
    return localStorage.getItem('child_birth_date') || '';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (birthDate) {
      localStorage.setItem('child_birth_date', birthDate);
    }
  }, [birthDate]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Notification Logic
  useEffect(() => {
    if (!birthDate) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const checkAndNotify = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();
      
      const [day1, day2] = getVaccinationDays(year, month);
      
      if (date === day1 || date === day2) {
        const todayStr = now.toISOString().split('T')[0];
        const lastNotified = localStorage.getItem('last_notified_date');
        
        if (lastNotified !== todayStr) {
          const age = calculateAge(new Date(birthDate));
          const dueVaccines = VACCINATION_SCHEDULE.filter(v => 
            getVaccineStatus(age.totalMonths, v.minAgeMonths, v.maxAgeMonths) === 'due'
          );
          
          if (dueVaccines.length > 0) {
            const vaccineNames = dueVaccines.map(v => v.name).join(', ');
            new Notification('Lịch tiêm chủng mở rộng', {
              body: `Hôm nay có lịch tiêm phường/xã! Bé có mũi cần tiêm: ${vaccineNames}`,
              icon: 'https://picsum.photos/seed/vaccine/192/192'
            });
            localStorage.setItem('last_notified_date', todayStr);
          }
        }
      }
    };

    checkAndNotify();
    const interval = setInterval(checkAndNotify, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [birthDate]);

  const age = birthDate ? calculateAge(new Date(birthDate)) : null;

  const exportPDF = () => {
    if (!birthDate || !age) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Lich tiem chung`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Ngay sinh: ${format(new Date(birthDate), 'dd/MM/yyyy')}`, 20, 30);
    doc.text(`Tuoi hien tai: ${age.years} nam, ${age.months} thang, ${age.days} ngay`, 20, 40);
    
    let y = 60;
    VACCINATION_SCHEDULE.forEach((v) => {
      const status = getVaccineStatus(age.totalMonths, v.minAgeMonths, v.maxAgeMonths);
      doc.text(`${v.name} (${v.dose}) - ${status.toUpperCase()}`, 20, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`lich-tiem.pdf`);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Cảm ơn! Khi truy cập ứng dụng vào ngày tiêm chủng hàng tháng, hệ thống sẽ gửi thông báo nhắc nhở.');
      } else {
        alert('Bạn đã từ chối nhận thông báo.');
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (date > new Date()) {
      alert("Ngày sinh không thể ở tương lai!");
      return;
    }
    setBirthDate(e.target.value);
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const [day1, day2] = getVaccinationDays(new Date().getFullYear(), new Date().getMonth());

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Syringe className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Tra Cứu Tiêm Chủng</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={requestNotificationPermission}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            title="Bật thông báo nhắc lịch"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6 pb-12">
        {/* Date Input Section */}
        <section className="glass p-6 rounded-3xl space-y-4 border-2 border-primary/20 shadow-sm">
          <h2 className="font-bold text-lg text-center">Nhập ngày sinh để tra cứu</h2>
          <div className="relative max-w-sm mx-auto">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={birthDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-lg font-medium transition-all cursor-pointer"
            />
          </div>
          
          <div className="mt-4 p-4 bg-accent/50 rounded-xl space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-primary font-bold mb-1">
              <Info className="w-5 h-5" />
              <span>Quy tắc lịch tiêm chủng hàng tháng</span>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mặc định lịch tiêm là ngày 3 và ngày 4 hàng tháng.</li>
              <li>Nếu ngày 3 rơi vào Thứ 7, lịch sẽ tự động đôn lên Thứ 2 (ngày 5) và Thứ 3 (ngày 6).</li>
              <li>Nếu ngày 3 rơi vào Chủ nhật, lịch sẽ tự động đôn lên Thứ 2 (ngày 4) và Thứ 3 (ngày 5).</li>
              <li>Nếu ngày 3 rơi vào Thứ 6, lịch sẽ là Thứ 6 (ngày 3) và Thứ 2 (ngày 6).</li>
            </ul>
            <p className="pt-2 border-t border-border/50 mt-2 text-foreground font-medium">
              👉 Tháng này, lịch tiêm dự kiến vào ngày {day1} và {day2}.
            </p>
          </div>
        </section>

        <AnimatePresence>
          {birthDate && age && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Age Card */}
              <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Baby className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div>
                    <h3 className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">Tuổi hiện tại</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black">{age.years}</span>
                      <span className="text-lg font-medium">năm</span>
                      <span className="text-4xl font-black ml-2">{age.months}</span>
                      <span className="text-lg font-medium">tháng</span>
                    </div>
                    <p className="text-primary-foreground/90 font-medium mt-1">
                      {age.days} ngày tuổi
                    </p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-bold opacity-70">Tổng số tháng</p>
                      <p className="text-xl font-bold">{age.totalMonths}</p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-bold opacity-70">Tổng số ngày</p>
                      <p className="text-xl font-bold">{age.totalDays}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button 
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border-2 border-border font-bold hover:bg-accent transition-colors"
              >
                <Download className="w-5 h-5" /> Xuất PDF Lịch Tiêm
              </button>

              {/* Vaccine Schedule */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Lịch tiêm chủng mở rộng
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Vietnam EPI</span>
                </h2>
                
                <div className="space-y-3">
                  {VACCINATION_SCHEDULE.map((v) => {
                    const status = getVaccineStatus(age.totalMonths, v.minAgeMonths, v.maxAgeMonths);
                    return (
                      <div 
                        key={v.id}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex items-start gap-4",
                          status === 'due' && "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10",
                          status === 'past' && "border-green-500/30 bg-green-50 dark:bg-green-900/10",
                          status === 'upcoming' && "border-border bg-card"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          status === 'due' && "bg-yellow-400 text-yellow-900",
                          status === 'past' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                          status === 'upcoming' && "bg-muted text-muted-foreground"
                        )}>
                          <span className="font-bold text-lg">
                            {status === 'due' ? '!' : status === 'past' ? '✓' : '💉'}
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold leading-tight">{v.name}</h4>
                            <span className={cn(
                              "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                              status === 'due' && "bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
                              status === 'past' && "bg-green-500/20 text-green-700 dark:text-green-400",
                              status === 'upcoming' && "bg-muted text-muted-foreground"
                            )}>
                              {status === 'due' ? 'Đến lịch' : status === 'past' ? 'Đã qua mốc' : 'Sắp tới'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{v.disease}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] bg-accent px-2 py-0.5 rounded-md font-bold">{v.dose}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {v.minAgeMonths === 0 ? 'Sơ sinh' : `${v.minAgeMonths} tháng`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
