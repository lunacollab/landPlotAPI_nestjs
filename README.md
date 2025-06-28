# Farm Management System API

Hệ thống quản lý nông trại hoàn chỉnh được xây dựng với NestJS, Prisma và MySQL.

## 🚀 Tính năng chính

- **Quản lý khu vực (Zones)**: 4 khu vực A, B, C, D với màu sắc riêng biệt
- **Quản lý ô đất (Land Plots)**: 12 ô đất (3 ô/khu vực) với thông tin chi tiết
- **Quản lý cây trồng (Crops)**: Hỗ trợ 4 loại cây trồng chính
- **Quản lý dịch vụ (Services)**: 7 loại dịch vụ nông nghiệp
- **Quản lý công nhân (Workers)**: Hệ thống phân công và lịch làm việc
- **Lịch trình (Scheduling)**: Hệ thống lên lịch thông minh với lock/unlock
- **Xác thực (Authentication)**: JWT-based với role-based access control
- **Báo cáo (Reports)**: Thống kê và báo cáo chi tiết

## 🛠️ Công nghệ sử dụng

- **Backend**: NestJS (TypeScript)
- **Database**: MySQL với Prisma ORM
- **Authentication**: JWT với Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest với coverage reports
- **File Upload**: Multer
- **Email**: Nodemailer (cho notifications)

## 📋 Yêu cầu hệ thống

- Node.js 18+
- MySQL 8.0+
- npm hoặc yarn

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd land-plot-api
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/farm_management"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# App
PORT=3000
NODE_ENV=development
```

### 4. Thiết lập database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Hoặc tạo migration
npm run db:migrate
```

### 5. Seed dữ liệu mẫu
```bash
npm run db:seed
```

### 6. Chạy ứng dụng
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

Sau khi chạy ứng dụng, truy cập Swagger UI tại:
```
http://localhost:3000/api/docs
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests với coverage
npm run test:cov

# E2E tests
npm run test:e2e

# E2E tests với coverage
npm run test:e2e:cov
```

## 📊 Dữ liệu mẫu

Sau khi chạy seed, hệ thống sẽ có:

### Users
- **Farm Owner**: `farmowner@example.com` / `farmowner123`
- **Worker 1**: `worker1@example.com` / `worker123`
- **Worker 2**: `worker2@example.com` / `worker123`

### Zones
- Zone A (Red) - North Area
- Zone B (Green) - South Area  
- Zone C (Blue) - East Area
- Zone D (Yellow) - West Area

### Land Plots
- 12 ô đất (3 ô/zone)
- Diện tích: 100-150 m²
- Tọa độ GPS cho mỗi ô

### Crops
- Orange (Fruit)
- Watermelon (Fruit)
- Green Cabbage (Vegetable)
- Tomato (Root Vegetable)

### Services
- Soil Preparation
- Seed Planting
- Watering
- Pesticide Application
- Fertilizing
- Pruning
- Harvesting

## 🔐 Authentication

### Endpoints
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/profile` - Thông tin profile

### Roles
- **FARM_OWNER**: Quyền quản trị toàn bộ hệ thống
- **WORKER**: Quyền xem lịch làm việc và cập nhật trạng thái

## 🏗️ Cấu trúc dự án

```
src/
├── common/                 # Shared components
│   ├── decorators/        # Custom decorators
│   ├── dto/              # Common DTOs
│   ├── exceptions/       # Custom exceptions
│   ├── filters/          # Exception filters
│   ├── guards/           # Authentication guards
│   ├── interceptors/     # Response transformers
│   └── interfaces/       # Common interfaces
├── config/               # Configuration files
├── modules/              # Feature modules
│   ├── auth/            # Authentication
│   ├── zones/           # Zone management
│   ├── land-plots/      # Land plot management
│   ├── crops/           # Crop management
│   ├── services/        # Service management
│   ├── workers/         # Worker management
│   ├── schedules/       # Schedule management
│   ├── assignments/     # Assignment management
│   ├── map/             # Map integration
│   └── reports/         # Reports & analytics
├── prisma/              # Database schema & migrations
└── test/                # Test files
```

## 🔧 Scripts

```bash
# Development
npm run start:dev        # Chạy với hot reload
npm run start:debug      # Chạy với debug mode

# Database
npm run db:generate      # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Create and run migrations
npm run db:seed         # Seed sample data
npm run db:studio       # Open Prisma Studio

# Testing
npm run test            # Unit tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
npm run test:e2e        # E2E tests

# Build
npm run build           # Build for production
npm run start:prod      # Start production server

# Code quality
npm run lint            # ESLint
npm run format          # Prettier
```

## 📈 Coverage Reports

Sau khi chạy `npm run test:cov`, xem báo cáo coverage tại:
```
coverage/lcov-report/index.html
```



### Manual Deployment
```bash
# Build
npm run build

# Start production
npm run start:prod
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request



---

**Happy Farming! 🌾**
