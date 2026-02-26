import sys
import os
import subprocess
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QPushButton, QFrame, QTextEdit, 
                             QSplitter, QSlider, QComboBox, QFileDialog, QMessageBox)
from PyQt6.QtCore import Qt, QProcess
from PyQt6.QtGui import QFont, QIcon

class IntegratedEnvironment(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("بيئة تشغيل APK الاحترافية v2026 - NexusDroid Runtime")
        self.setMinimumSize(1280, 850)
        self.setLayoutDirection(Qt.LayoutDirection.RightToLeft)

        # الواجهة الرئيسية (تقسيم الشاشة)
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QHBoxLayout(self.central_widget)
        self.main_layout.setContentsMargins(0, 0, 0, 0)
        self.main_layout.setSpacing(0)

        # استخدام Splitter للسماح للمستخدم بتغيير حجم الشاشة والتحكم
        self.splitter = QSplitter(Qt.Orientation.Horizontal)
        self.splitter.setHandleWidth(2)

        self.setup_sidebar()     # أدوات التحكم (اليمين)
        self.setup_game_view()   # شاشة اللعبة (اليسار)

        self.main_layout.addWidget(self.splitter)
        self.apply_styles()

        # متغيرات النظام
        self.scrcpy_process = None
        self.current_apk = None

    def setup_sidebar(self):
        self.sidebar = QFrame()
        self.sidebar.setMinimumWidth(320)
        self.sidebar.setMaximumWidth(400)
        self.sidebar.setObjectName("Sidebar")
        layout = QVBoxLayout(self.sidebar)
        layout.setSpacing(15)
        layout.setContentsMargins(20, 30, 20, 20)

        # العنوان
        title_container = QWidget()
        title_layout = QHBoxLayout(title_container)
        title_layout.setContentsMargins(0,0,0,0)
        
        title = QLabel("🛠️ أدوات التشغيل")
        title.setFont(QFont("Segoe UI", 16, QFont.Weight.Bold))
        title_layout.addWidget(title)
        layout.addWidget(title_container)

        # قسم التحكم الأساسي
        control_group = QFrame()
        control_group.setObjectName("ControlGroup")
        control_layout = QVBoxLayout(control_group)
        
        self.btn_load = QPushButton("📂 فتح ملف APK")
        self.btn_load.clicked.connect(self.select_apk)
        
        self.btn_run = QPushButton("🚀 بدء التشغيل الداخلي")
        self.btn_run.clicked.connect(self.launch_internal_engine)
        
        control_layout.addWidget(self.btn_load)
        control_layout.addWidget(self.btn_run)
        layout.addWidget(control_group)

        # قسم الأدوات المتقدمة (Unified Toolkit)
        tools_label = QLabel("الأدوات المدمجة")
        tools_label.setStyleSheet("color: #94a3b8; font-size: 12px; font-weight: bold;")
        layout.addWidget(tools_label)

        tools_group = QFrame()
        tools_group.setObjectName("ToolsGroup")
        tools_layout = QVBoxLayout(tools_group)

        self.btn_keymapper = QPushButton("🎮 ضبط الأزرار (Keymapper)")
        self.btn_record = QPushButton("🎥 تسجيل شاشة اللعب")
        self.btn_fps = QPushButton("⚡ معزز الأداء (FPS Booster)")
        
        # Resolution Scaler
        res_layout = QHBoxLayout()
        res_label = QLabel("دقة الشاشة:")
        self.combo_res = QComboBox()
        self.combo_res.addItems(["1080p (FHD)", "720p (HD)", "540p (SD)"])
        res_layout.addWidget(res_label)
        res_layout.addWidget(self.combo_res)

        tools_layout.addWidget(self.btn_keymapper)
        tools_layout.addWidget(self.btn_record)
        tools_layout.addWidget(self.btn_fps)
        tools_layout.addLayout(res_layout)
        layout.addWidget(tools_group)

        # Bitrate Control
        bitrate_label = QLabel("جودة البث (Bitrate):")
        bitrate_label.setStyleSheet("color: #94a3b8; font-size: 12px; font-weight: bold;")
        layout.addWidget(bitrate_label)
        
        self.slider_bitrate = QSlider(Qt.Orientation.Horizontal)
        self.slider_bitrate.setMinimum(2)
        self.slider_bitrate.setMaximum(20)
        self.slider_bitrate.setValue(8)
        self.slider_bitrate.setTickPosition(QSlider.TickPosition.TicksBelow)
        self.slider_bitrate.setTickInterval(2)
        layout.addWidget(self.slider_bitrate)
        
        self.lbl_bitrate_val = QLabel("8 Mbps")
        self.lbl_bitrate_val.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.lbl_bitrate_val.setStyleSheet("color: #22d3ee;")
        layout.addWidget(self.lbl_bitrate_val)
        
        self.slider_bitrate.valueChanged.connect(lambda v: self.lbl_bitrate_val.setText(f"{v} Mbps"))

        # السجل
        self.log_view = QTextEdit()
        self.log_view.setReadOnly(True)
        self.log_view.setPlaceholderText("سجل النظام الحقيقي... بانتظار الاتصال بـ ADB")
        layout.addWidget(self.log_view)

        self.splitter.addWidget(self.sidebar)

    def setup_game_view(self):
        self.game_container = QFrame()
        self.game_container.setStyleSheet("background-color: #000;")
        layout = QVBoxLayout(self.game_container)
        layout.setContentsMargins(0, 0, 0, 0)

        # شاشة الانتظار
        self.display_label = QLabel("شاشة العرض\n(بانتظار بدء المحرك...)")
        self.display_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.display_label.setStyleSheet("color: #475569; font-size: 20px;")
        layout.addWidget(self.display_label)

        # هذا الـ Widget هو الذي سيعرض اللعبة فعلياً
        self.game_screen = QWidget()
        self.game_screen.setObjectName("GameScreen")
        self.game_screen.setAttribute(Qt.WidgetAttribute.WA_NativeWindow)
        self.game_screen.setAttribute(Qt.WidgetAttribute.WA_PaintOnScreen)
        self.game_screen.hide() # Hide initially
        layout.addWidget(self.game_screen)

        self.splitter.addWidget(self.game_container)

    def select_apk(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "اختر ملف APK", "", "Android Packages (*.apk *.xapk)")
        if file_name:
            self.current_apk = file_name
            self.log_view.append(f"📂 تم تحديد الملف: {os.path.basename(file_name)}")
            self.btn_load.setText(f"ملف: {os.path.basename(file_name)}")

    def launch_internal_engine(self):
        self.log_view.append("🔄 جاري التحقق من ADB...")
        
        # 1. Check ADB
        adb_check = subprocess.run(["adb", "devices"], capture_output=True, text=True)
        if "device" not in adb_check.stdout.replace("List of devices attached", "").strip():
            self.log_view.append("❌ لم يتم العثور على جهاز/محاكي متصل. يرجى تشغيل المحاكي أولاً.")
            QMessageBox.warning(self, "خطأ", "يرجى تشغيل المحاكي (Emulator) أو توصيل الهاتف وتفعيل USB Debugging.")
            return

        # 2. Install APK if selected
        if self.current_apk:
            self.log_view.append(f"📦 جاري تثبيت {os.path.basename(self.current_apk)}...")
            subprocess.Popen(["adb", "install", "-r", self.current_apk])
            # Note: In a real app, we'd wait for this or use a thread.

        self.log_view.append("🔄 جاري ربط محرك العرض بالنافذة...")
        self.display_label.hide()
        self.game_screen.show()
        
        # استخراج رقم النافذة لدمج المحرك فيها
        window_id = str(int(self.game_screen.winId()))
        
        # إعدادات الجودة
        bitrate = str(self.slider_bitrate.value()) + "M"
        max_fps = "144"
        
        # تشغيل المحرك (scrcpy) ودمجه داخل نافذة البرنامج
        self.process = QProcess(self)
        
        # ملاحظة: نفترض وجود scrcpy في مسار النظام أو بجوار الملف
        # في التجميع النهائي، يتم وضع scrcpy في مجلد 'bin'
        scrcpy_cmd = "scrcpy" 
        
        args = [
            "--parent", window_id,      # دمج النافذة (Parent-Child)
            "--no-control",             # (مؤقت) لضمان العرض أولاً
            "--window-borderless",      # بدون حدود
            "--max-fps", max_fps,       # دعم السرعة العالية
            "--video-bit-rate", bitrate,# التحكم في الجودة
            "--render-driver", "vulkan",# استخدام Vulkan
            "--always-on-top"
        ]
        
        self.log_view.append(f"🚀 تشغيل الأمر: scrcpy {' '.join(args)}")
        
        self.process.start(scrcpy_cmd, args)
        self.process.finished.connect(self.on_engine_stop)
        
        self.log_view.append("✅ المحرك يعمل الآن داخل البيئة المدمجة.")

    def on_engine_stop(self):
        self.log_view.append("🛑 توقف المحرك.")
        self.game_screen.hide()
        self.display_label.show()

    def apply_styles(self):
        self.setStyleSheet("""
            QMainWindow { background-color: #020617; }
            QFrame#Sidebar { background-color: #0f172a; border-right: 1px solid #1e293b; }
            QFrame#ControlGroup, QFrame#ToolsGroup { 
                background-color: #1e293b; 
                border-radius: 8px; 
                padding: 10px;
            }
            QPushButton { 
                background-color: #334155; 
                color: white; 
                padding: 10px; 
                border-radius: 6px; 
                font-family: 'Segoe UI';
                border: 1px solid #475569;
            }
            QPushButton:hover { background-color: #475569; border-color: #64748b; }
            QPushButton:pressed { background-color: #2563eb; border-color: #3b82f6; }
            
            QLabel { color: #f8fafc; font-family: 'Segoe UI'; }
            
            QTextEdit { 
                background-color: #000; 
                color: #10b981; 
                border: 1px solid #1e293b; 
                border-radius: 6px; 
                font-family: 'Consolas', monospace;
                font-size: 12px;
            }
            
            QSlider::groove:horizontal {
                border: 1px solid #1e293b;
                height: 8px;
                background: #0f172a;
                margin: 2px 0;
                border-radius: 4px;
            }
            QSlider::handle:horizontal {
                background: #22d3ee;
                border: 1px solid #22d3ee;
                width: 18px;
                height: 18px;
                margin: -7px 0;
                border-radius: 9px;
            }
            
            QComboBox {
                background-color: #334155;
                color: white;
                border: 1px solid #475569;
                border-radius: 4px;
                padding: 5px;
            }
        """)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    # تعيين خط التطبيق
    font = QFont("Segoe UI", 10)
    app.setFont(font)
    
    window = IntegratedEnvironment()
    window.show()
    sys.exit(app.exec())
