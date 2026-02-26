import sys
import os
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QPushButton, QFrame, QTextEdit)
from PyQt6.QtCore import Qt, QSize
from PyQt6.QtGui import QDragEnterEvent, QDropEvent, QFont, QIcon

class ModernEmulatorGUI(QMainWindow):
    def __init__(self):
        super().__init__()

        # إعدادات النافذة الرئيسية
        self.setWindowTitle("محاكي ومعدل APK المتقدم 2026")
        self.setMinimumSize(900, 600)
        
        # تفعيل دعم اللغة العربية (من اليمين إلى اليسار)
        self.setLayoutDirection(Qt.LayoutDirection.RightToLeft)

        # الواجهة المركزية
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QVBoxLayout(self.central_widget)

        # استدعاء أجزاء التصميم
        self.setup_header()
        self.setup_drop_area()
        self.setup_log_area()
        self.setup_footer()

        # تطبيق ستايل CSS عصري (Glassmorphism inspired)
        self.setStyleSheet("""
            QMainWindow { background-color: #0f172a; }
            QLabel { color: #f8fafc; font-family: 'Segoe UI', 'Arial'; }
            QPushButton { 
                background-color: #2563eb; color: white; border-radius: 8px; 
                padding: 10px; font-weight: bold; font-size: 14px;
            }
            QPushButton:hover { background-color: #3b82f6; }
            QFrame#DropArea {
                border: 2px dashed #334155; border-radius: 15px; background-color: #1e293b;
            }
            QTextEdit { 
                background-color: #020617; color: #10b981; border: 1px solid #1e293b;
                font-family: 'Consolas', monospace; border-radius: 5px;
            }
        """)

    def setup_header(self):
        header_layout = QHBoxLayout()
        title = QLabel("مركز تعديل وتشغيل التطبيقات الذكي")
        title.setFont(QFont("Arial", 20, QFont.Weight.Bold))
        header_layout.addWidget(title)
        
        # زر المساعد الذكي AI
        self.ai_btn = QPushButton("مساعد الذكاء الاصطناعي ✨")
        self.ai_btn.setFixedWidth(180)
        header_layout.addWidget(self.ai_btn)
        
        self.main_layout.addLayout(header_layout)

    def setup_drop_area(self):
        # منطقة السحب والإفلات
        self.drop_frame = QFrame()
        self.drop_frame.setObjectName("DropArea")
        self.drop_frame.setAcceptDrops(True)
        self.drop_frame.setMinimumHeight(250)
        
        # تفعيل وظائف السحب والإفلات برمجياً
        self.drop_frame.dragEnterEvent = self.on_drag_enter
        self.drop_frame.dropEvent = self.on_drop
        
        drop_layout = QVBoxLayout(self.drop_frame)
        self.drop_label = QLabel("قم بسحب ملف APK أو XAPK هنا للبدء")
        self.drop_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.drop_label.setFont(QFont("Arial", 16))
        
        drop_layout.addWidget(self.drop_label)
        self.main_layout.addWidget(self.drop_frame)

    def setup_log_area(self):
        self.log_label = QLabel("سجل العمليات (Logs):")
        self.main_layout.addWidget(self.log_label)
        
        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setPlaceholderText("بانتظار رفع الملفات...")
        self.main_layout.addWidget(self.log_output)

    def setup_footer(self):
        footer_layout = QHBoxLayout()
        
        self.btn_mod = QPushButton("تعديل العملات/الجواهر")
        self.btn_offline = QPushButton("تفعيل وضع الأوفلاين")
        self.btn_run = QPushButton("تشغيل في المحاكي")
        
        footer_layout.addWidget(self.btn_mod)
        footer_layout.addWidget(self.btn_offline)
        footer_layout.addWidget(self.btn_run)
        
        self.main_layout.addLayout(footer_layout)

    # وظائف السحب والإفلات
    def on_drag_enter(self, event: QDragEnterEvent):
        if event.mimeData().hasUrls():
            event.accept()
            self.drop_frame.setStyleSheet("background-color: #334155; border: 2px dashed #60a5fa;")
        else:
            event.ignore()

    def on_drop(self, event: QDropEvent):
        files = [u.toLocalFile() for u in event.mimeData().urls()]
        for file in files:
            if file.endswith(('.apk', '.xapk')):
                self.log_output.append(f"✅ تم استلام الملف: {os.path.basename(file)}")
                self.drop_label.setText(f"تم تحميل: {os.path.basename(file)}")
                # هنا سيتم استدعاء كود فك التشفير لاحقاً
            else:
                self.log_output.append(f"❌ خطأ: الملف {os.path.basename(file)} ليس بصيغة مدعومة.")
        
        self.drop_frame.setStyleSheet("") # إعادة الستايل الأصلي

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ModernEmulatorGUI()
    window.show()
    sys.exit(app.exec())
