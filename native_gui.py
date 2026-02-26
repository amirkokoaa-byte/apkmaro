import sys
import os
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QPushButton, QFrame, QTextEdit, QFileDialog)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QDragEnterEvent, QDropEvent, QFont

class ModernEmulatorGUI(QMainWindow):
    def __init__(self):
        super().__init__()

        # إعدادات النافذة الرئيسية
        self.setWindowTitle("محاكي ومعدل APK المتقدم 2026")
        self.setMinimumSize(900, 650)
        
        # تفعيل دعم اللغة العربية
        self.setLayoutDirection(Qt.LayoutDirection.RightToLeft)

        # الواجهة المركزية
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QVBoxLayout(self.central_widget)

        # السماح بالسحب والإفلات للنافذة الرئيسية
        self.setAcceptDrops(True)

        self.setup_header()
        self.setup_drop_area()
        self.setup_log_area()
        self.setup_footer()

        # تصميم CSS محسن
        self.setStyleSheet("""
            QMainWindow { background-color: #0f172a; }
            QLabel { color: #f8fafc; font-family: 'Segoe UI', 'Arial'; }
            QPushButton { 
                background-color: #2563eb; color: white; border-radius: 8px; 
                padding: 12px; font-weight: bold; font-size: 14px;
            }
            QPushButton:hover { background-color: #3b82f6; }
            QPushButton#SelectBtn { background-color: #10b981; } /* لون أخضر لزر الاختيار */
            QPushButton#SelectBtn:hover { background-color: #059669; }
            QFrame#DropArea {
                border: 2px dashed #3b82f6; border-radius: 15px; background-color: #1e293b;
            }
            QTextEdit { 
                background-color: #020617; color: #10b981; border: 1px solid #1e293b;
                font-family: 'Consolas', monospace; border-radius: 5px; font-size: 13px;
            }
        """)

    def setup_header(self):
        header_layout = QHBoxLayout()
        title = QLabel("مركز تعديل وتشغيل التطبيقات الذكي")
        title.setFont(QFont("Arial", 20, QFont.Weight.Bold))
        header_layout.addWidget(title)
        
        self.ai_btn = QPushButton("مساعد الذكاء الاصطناعي ✨")
        self.ai_btn.setFixedWidth(200)
        header_layout.addWidget(self.ai_btn)
        
        self.main_layout.addLayout(header_layout)

    def setup_drop_area(self):
        # حاوية منطقة السحب
        self.drop_frame = QFrame()
        self.drop_frame.setObjectName("DropArea")
        self.drop_frame.setMinimumHeight(200)
        
        drop_layout = QVBoxLayout(self.drop_frame)
        
        self.drop_label = QLabel("قم بسحب ملف APK أو XAPK هنا")
        self.drop_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.drop_label.setFont(QFont("Arial", 16))
        drop_layout.addWidget(self.drop_label)

        # زر اختيار ملف يدوي
        self.select_file_btn = QPushButton("أو إضغط هنا لاختيار ملف من الجهاز")
        self.select_file_btn.setObjectName("SelectBtn")
        self.select_file_btn.setFixedWidth(300)
        self.select_file_btn.clicked.connect(self.open_file_dialog)
        drop_layout.addWidget(self.select_file_btn, alignment=Qt.AlignmentFlag.AlignCenter)
        
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

    # وظيفة اختيار ملف يدوي
    def open_file_dialog(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "اختر ملف اللعبة", "", "Android Files (*.apk *.xapk);;All Files (*)"
        )
        if file_path:
            self.process_file(file_path)

    # معالجة السحب والإفلات
    def dragEnterEvent(self, event: QDragEnterEvent):
        if event.mimeData().hasUrls():
            event.accept()
            self.drop_frame.setStyleSheet("background-color: #334155; border: 2px solid #60a5fa;")
        else:
            event.ignore()

    def dropEvent(self, event: QDropEvent):
        files = [u.toLocalFile() for u in event.mimeData().urls()]
        for file in files:
            self.process_file(file)
        self.drop_frame.setStyleSheet("")

    # دالة موحدة للتعامل مع الملف المختار
    def process_file(self, file_path):
        file_name = os.path.basename(file_path)
        if file_path.lower().endswith(('.apk', '.xapk')):
            self.log_output.append(f"<b>✅ تم تحميل الملف بنجاح:</b> {file_name}")
            self.drop_label.setText(f"تم اختيار: {file_name}")
            self.log_output.append(f"<i>المسار: {file_path}</i>")
            self.log_output.append("-" * 50)
        else:
            self.log_output.append(f"<b>❌ خطأ:</b> الملف {file_name} ليس بصيغة APK مدعومة.")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ModernEmulatorGUI()
    window.show()
    sys.exit(app.exec())
