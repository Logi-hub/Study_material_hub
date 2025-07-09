 📚 Study Material Hub

A centralized web platform to **upload, view, save, and manage study materials**. Built with **Next.js + Django**, this full-stack application supports **OTP-based signup**, **JWT login**, **role-based access**, and **material preview/download features**.


🧭 Table of Contents

- [🚀 Features](#-features)
- [🛠 Tools & Technologies](#-tools--technologies)
- [⚙️ Installation](#️-installation)
- [👨‍💻 Project Structure](#-project-structure)
- [🔐 Authentication System](#-authentication-system)
- [📸 Screenshots](#-screenshots)
- [🎥 Demo Video](#-demo-video)
- [🤝 For Contributors](#-for-contributors)


🚀 Features

- 🔐 OTP-based Signup with Email Verification
- 🔑 JWT-based Authentication for Login
- 👥 User Roles: Reader & Uploader
- 📁 Upload Materials with Title, Subject, Author, File
- 🔍 Search Functionality for Materials
- 📥 Download and Save Materials
- 🧾 User Dashboard with Saved Items, Profile, Password Reset
- 📤 Admin & Authorized Uploader Panel
- ⚙️ Forgot Password with OTP Reset
- 💡 Fully responsive UI with modern design


🛠 Tools & Technologies

-🔧 Backend
- Django
- Django REST Framework
- djangorestframework-simplejwt
- python-decouple
- MySQL

🎨 Frontend
- Next.js
- Tailwind CSS
- React
- Axios
 🗃 Database
- MySQL
  
 🔐 Authentication
- JWT (SimpleJWT)
- OTP via SMTP

🛠 Version Control & IDE
- Git & GitHub
- Visual Studio Code

⚙️ Installation

🔽 Clone this repo
```bash
git clone https://github.com/your-username/study-material-hub.git
cd study-material-hub

---backend setup

cd backend_project
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


---frontend setup

cd frontend
npm install
npm run dev


---project structure

/workcohol project
|-- /backend_project
|   |-- backend_project/
|   |-- study_material_hub/
|   └-- manage.py
|
|-- /frontend
|   |-- app/
|   |-- components/
|   └-- package.json



🔐 Authentication System

Signup: Users provide name and email → OTP sent → on success → role selection → reader/uploader path

JWT: On login, JWT token stored in localStorage for protected API access

Forgot/Reset Password: Email OTP → reset password with validation

---Screenshorts


![Screenshot (32)](https://github.com/user-attachments/assets/de3b0fd2-5265-4d95-8bdb-0fff639996d5)
![Screenshot (33)](https://github.com/user-attachments/assets/7fe16900-89ad-4c4d-b266-c0dfa4e84a47)
![Screenshot (34)](https://github.com/user-attachments/assets/2b23ddf5-6e4e-4824-9369-7b825522ba94)
![Screenshot (35)](https://github.com/user-attachments/assets/0abc2f67-cc1e-41f4-8608-30644a2327cf)
![Screenshot (36)](https://github.com/user-attachments/assets/b23b162b-124b-4796-bc36-f0c94c748b4c)
![Screenshot (37)](https://github.com/user-attachments/assets/1136e034-ebc5-4ed3-9233-93e1a9396879)
![Screenshot (38)](https://github.com/user-attachments/assets/5abece6a-00fa-4222-b714-8df905fff8fd)
![Screenshot (39)](https://github.com/user-attachments/assets/4d3a3b6d-5db3-4e6e-8461-70267b4d83c2)
![Screenshot (40)](https://github.com/user-attachments/assets/8badf9d4-ae29-4848-9205-f2a8773c34cc)
![Screenshot (41)](https://github.com/user-attachments/assets/3ababbca-d9eb-4183-880b-2873af03d31f)
![Screenshot (42)](https://github.com/user-attachments/assets/7b15adb3-70e6-4a4d-8557-0bb4b63863e2)
![Screenshot (43)](https://github.com/user-attachments/assets/68329d05-a527-4fe5-b3c8-edf47b248fc7)


🤝 For Contributors

🔧 Requirements

Python 3.12+

Node.js 18+

Django 5.x

MySQL

Git



📌 Steps

# Clone the project
git clone https://github.com/your-username/study-material-hub.git

# Setup backend
cd backend_project
python -m venv env
env\Scripts\activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install

Pull requests are welcome! 🙌
