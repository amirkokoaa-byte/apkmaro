import sys
import os
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QPushButton, QFrame, QTextEdit, QFileDialog)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QDragEnterEvent, QDropEvent, QFont

class SuperEmulatorGUI(QMainWindow):
    def __init__(self):
        super().__init__()

        # إعدادات النافذة الأساسية
        self.setWindowTitle("محاكي ومعدل APK الشامل - إصدار 2026")
        self.setMinimumSize(1000, 700)
        
        # تفعيل دعم اللغة العربية (RTL)
        self.setLayoutDirection(Qt.LayoutDirection.RightToLeft)

        # الواجهة المركزية
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QVBoxLayout(self.central_widget)

        # هام جداً: السماح بالسحب والإفلات للنافذة بالكامل
        self.setAcceptDrops(True)

        self.setup_ui()
        self.apply_styles()

    def setup_ui(self):
        # 1. العنوان
        header = QLabel("نظام تشغيل وتعديل ملفات APK/XAPK")
        header.setFont(QFont("Arial", 22, QFont.Weight.Bold))
        header.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.main_layout.addWidget(header)

        # 2. منطقة السحب والإفلات + زر الاختيار اليدوي
        self.drop_frame = QFrame()
        self.drop_frame.setObjectName("DropArea")
        self.drop_frame.setMinimumHeight(250)
        
        drop_layout = QVBoxLayout(self.drop_frame)
        
        self.icon_label = QLabel("📁") # أيقونة تعبيرية
        self.icon_label.setFont(QFont("Arial", 50))
        self.icon_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        drop_layout.addWidget(self.icon_label)

        self.drop_label = QLabel("اسحب ملف الـ APK هنا")
        self.drop_label.setFont(QFont("Arial", 16))
        self.drop_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        drop_layout.addWidget(self.drop_label)

        # زر "اختيار ملف" (الحل البديل والأضمن)
        self.select_btn = QPushButton("أو اختر الملف من جهازك")
        self.select_btn.setFixedWidth(250)
        self.select_btn.clicked.connect(self.open_file_dialog)
        drop_layout.addWidget(self.select_btn, alignment=Qt.AlignmentFlag.AlignCenter)

        self.main_layout.addWidget(self.drop_frame)

        # 3. سجل العمليات
        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setPlaceholderText("بانتظار اختيار ملف لبدء العمل...")
        self.main_layout.addWidget(self.log_output)

    def apply_styles(self):
        self.setStyleSheet("""
            QMainWindow { background-color: #020617; }
            QLabel { color: #f8fafc; }
            QFrame#DropArea {
                border: 3px dashed #1e40af;
                border-radius: 20px;
                background-color: #0f172a;
            }
            QPushButton {
                background-color: #2563eb;
                color: white;
                border-radius: 10px;
                padding: 12px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #3b82f6; }
            QTextEdit {
                background-color: #000000;
                color: #22c55e;
                font-family: 'Consolas';
                border: 1px solid #1e293b;
                border-radius: 10px;
            }
        """)

    # --- معالجة اختيار الملف يدوياً ---
    def open_file_dialog(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "اختر ملف APK", "", "Android Files (*.apk *.xapk)"
        )
        if file_path:
            self.handle_file(file_path)

    # --- معالجة السحب والإفلات ---
    def dragEnterEvent(self, event: QDragEnterEvent):
        if event.mimeData().hasUrls():
            event.accept()
            self.drop_frame.setStyleSheet("background-color: #1e293b; border: 3px solid #60a5fa;")
        else:
            event.ignore()

    def dragLeaveEvent(self, event):
        self.apply_styles() # إعادة الشكل الأصلي عند خروج الملف

    def dropEvent(self, event: QDropEvent):
        files = [u.toLocalFile() for u in event.mimeData().urls()]
        for file_path in files:
            self.handle_file(file_path)
        self.apply_styles()

    def handle_file(self, path):
        file_name = os.path.basename(path)
        if path.lower().endswith(('.apk', '.xapk')):
            self.log_output.append(f"<b>✅ تم التعرف على:</b> {file_name}")
            self.log_output.append(f"<i>المسار: {path}</i>")
            self.drop_label.setText(f"تم تحميل: {file_name}")
            self.log_output.append("-" * 30)
        else:
            self.log_output.append(f"<b>❌ خطأ:</b> الملف {file_name} ليس بصيغة أندرويد مدعومة.")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SuperEmulatorGUI()
    window.show()
    sys.exit(app.exec())
