import sys
import os
import subprocess
import shutil
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QPushButton, QFrame, QTextEdit, QFileDialog, QProgressBar, QMessageBox)
from PyQt6.QtCore import Qt, QThread, pyqtSignal
from PyQt6.QtGui import QFont

# --- محرك التشغيل مع فحص المتطلبات (Enhanced Runner Engine) ---
class RunnerThread(QThread):
    log_signal = pyqtSignal(str)
    progress_signal = pyqtSignal(int)
    error_signal = pyqtSignal(str, str) # العنوان، الرسالة

    def __init__(self, apk_path):
        super().__init__()
        self.apk_path = apk_path

    def check_requirements(self):
        """فحص وجود ADB واتصال المحاكي"""
        # 1. فحص هل ADB مثبت في النظام
        if shutil.which("adb") is None:
            self.error_signal.emit("أداة ADB مفقودة", "لم يتم العثور على ADB. يرجى تثبيت Android SDK أو وضع ملف adb.exe في مسار النظام.")
            return False
        
        # 2. فحص هل المحاكي يعمل ومتصل
        check_adb = subprocess.run(["adb", "devices"], capture_output=True, text=True)
        if "device\n" not in check_adb.stdout:
            self.error_signal.emit("المحاكي غير متصل", "تأكد من فتح المحاكي (BlueStacks/Nox) وتفعيل خيار ADB من الإعدادات.")
            return False
            
        return True

    def run(self):
        try:
            self.progress_signal.emit(5)
            self.log_signal.emit("🔍 جاري فحص متطلبات التشغيل...")
            
            if not self.check_requirements():
                self.progress_signal.emit(0)
                return

            self.log_signal.emit("✅ جميع المتطلبات متوفرة. يبدأ العمل...")
            self.progress_signal.emit(20)

            # تثبيت ملف APK
            self.log_signal.emit(f"📥 جاري تثبيت: {os.path.basename(self.apk_path)}...")
            install_cmd = subprocess.run(["adb", "install", "-r", self.apk_path], capture_output=True, text=True)
            
            if "Success" in install_cmd.stdout:
                self.log_signal.emit("✅ تم التثبيت بنجاح.")
                self.progress_signal.emit(70)
                
                # تشغيل اللعبة
                self.log_signal.emit("🎮 جاري فتح اللعبة على المحاكي...")
                # استخدام أمر استخراج الحزمة والتشغيل
                pkg_cmd = f"adb shell monkey -p $(aapt dump badging {self.apk_path} | grep package | awk -F \"'\" '{{print $2}}') -c android.intent.category.LAUNCHER 1"
                subprocess.Popen(pkg_cmd, shell=True)
                
                self.log_signal.emit("🎉 استمتع باللعب!")
                self.progress_signal.emit(100)
            else:
                self.log_signal.emit(f"❌ فشل التثبيت: {install_cmd.stderr}")
                self.progress_signal.emit(0)

        except Exception as e:
            self.log_signal.emit(f"💥 خطأ غير متوقع: {str(e)}")

# --- الواجهة الرئيسية الاحترافية ---
class SuperEmulatorGUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("محاكي ومعدل APK 2026 - الإصدار المتكامل")
        self.setMinimumSize(950, 700)
        self.setLayoutDirection(Qt.LayoutDirection.RightToLeft)
        self.selected_apk = None

        self.setup_ui()
        self.apply_styles()

    def setup_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # رأس البرنامج والتعليمات
        header = QLabel("نظام تشغيل ملفات APK الذكي")
        header.setFont(QFont("Arial", 22, QFont.Weight.Bold))
        layout.addWidget(header, alignment=Qt.AlignmentFlag.AlignCenter)

        info_box = QLabel("⚠️ ملاحظة: يجب فتح المحاكي وتفعيل ADB قبل التشغيل.")
        info_box.setStyleSheet("color: #fbbf24; font-size: 13px;")
        layout.addWidget(info_box, alignment=Qt.AlignmentFlag.AlignCenter)

        # منطقة اختيار الملف
        self.drop_frame = QFrame()
        self.drop_frame.setObjectName("DropArea")
        drop_layout = QVBoxLayout(self.drop_frame)
        self.drop_label = QLabel("اسحب الملف هنا أو استخدم الزر بالأسفل")
        drop_layout.addWidget(self.drop_label, alignment=Qt.AlignmentFlag.AlignCenter)
        
        self.select_btn = QPushButton("📂 اختيار ملف APK")
        self.select_btn.clicked.connect(self.open_file_dialog)
        drop_layout.addWidget(self.select_btn, alignment=Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.drop_frame)

        # شريط التقدم
        self.progress_bar = QProgressBar()
        layout.addWidget(self.progress_bar)

        # سجل العمليات
        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setPlaceholderText("سجل النظام...")
        layout.addWidget(self.log_output)

        # أزرار التحكم
        btn_layout = QHBoxLayout()
        self.run_btn = QPushButton("▶️ تشغيل اللعبة")
        self.run_btn.setFixedHeight(50)
        self.run_btn.setEnabled(False)
        self.run_btn.clicked.connect(self.start_runner)
        
        self.clear_btn = QPushButton("🗑️ مسح السجل")
        self.clear_btn.clicked.connect(lambda: self.log_output.clear())
        
        btn_layout.addWidget(self.run_btn, 3)
        btn_layout.addWidget(self.clear_btn, 1)
        layout.addLayout(btn_layout)

    def apply_styles(self):
        self.setStyleSheet("""
            QMainWindow { background-color: #0f172a; }
            QLabel { color: #f8fafc; font-family: 'Arial'; }
            QFrame#DropArea { border: 2px dashed #3b82f6; border-radius: 15px; background-color: #1e293b; padding: 20px; }
            QPushButton { background-color: #2563eb; color: white; border-radius: 8px; font-weight: bold; }
            QPushButton:hover { background-color: #3b82f6; }
            QPushButton:disabled { background-color: #334155; color: #94a3b8; }
            QProgressBar { border-radius: 5px; text-align: center; color: white; background-color: #1e293b; }
            QProgressBar::chunk { background-color: #10b981; }
            QTextEdit { background-color: #020617; color: #4ade80; font-family: 'Consolas'; border-radius: 8px; }
        """)

    def open_file_dialog(self):
        path, _ = QFileDialog.getOpenFileName(self, "اختر ملف", "", "Android Files (*.apk *.xapk)")
        if path:
            self.selected_apk = path
            self.drop_label.setText(f"✅ تم اختيار: {os.path.basename(path)}")
            self.run_btn.setEnabled(True)
            self.log_output.append(f"📦 ملف جاهز: {path}")

    def show_error_dialog(self, title, message):
        QMessageBox.critical(self, title, message)

    def start_runner(self):
        self.runner_thread = RunnerThread(self.selected_apk)
        self.runner_thread.log_signal.connect(self.log_output.append)
        self.runner_thread.progress_signal.connect(self.progress_bar.setValue)
        self.runner_thread.error_signal.connect(self.show_error_dialog)
        self.runner_thread.start()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SuperEmulatorGUI()
    window.show()
    sys.exit(app.exec())
