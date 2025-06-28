# Farm Management System - Complete Requirements Specification

## Project Overview & Technology Stack

### Application Requirements
- **Framework**: NestJs
- **Database**:  MySQL  
- **Deployment**: Localhost web application
- **Architecture**: Full-stack web application with RESTful API

---

## Detailed Functional Requirements

### 1. Land Plot & Zone Management (Quản trị ô đất và khu đất)

#### Land Plot Information
- **Plot ID**: Unique identifier for each land plot
- **Name**: Descriptive name for the plot
- **Soil Type**: Classification of soil composition
- **Area**: Plot area measurement in square meters
- **Location**: 
  - Zone assignment (4 zones: A, B, C, D)
  - Each zone contains 3 land plots (total 12 plots)
  - GPS coordinates on map
- **Status**: 
  - Empty (Trống)
  - In Use (đang sử dụng)
  - Under Renovation (đang cải tạo)
  - Locked (đang Lock)
- **Usage History**: Previous season crop information
- **Notes**: Optional additional information

### 2. Crop Management (Quản trị cây trồng)

#### Crop Information
- **Crop ID**: Unique identifier
- **Crop Name**: Common name of the crop
- **Crop Categories**:
  - **Fruit Trees**: Orange (Cam), Watermelon (Dưa Hấu)
  - **Vegetables**: Green Cabbage (Rau Cải Xanh), Bean Pod (Rau Đậu Bắp)
  - **Root Vegetables**: Corn (Ngô), Potato (Khoai Tây), Tomato (Cà Chua)
  - **Herbs & Spices**: Green Onion (Hành Lá), Chili (Ớt), Lemon (Chanh)

#### Crop Management Data
- **Category Count**: 4 main categories
- **Variety Count**: Number of varieties per crop
- **Growth Cycle**: Days from germination to harvest
- **Planting Suggestions**: Recommended planting times
- **Expected Yield**: Projected production volume
- **Status**: Current crop status
- **Care History**: Previous season care records

### 3. Worker Management (Quản trị người làm)

#### Worker Information
- **Worker ID**: Unique identifier
- **Name**: Full name
- **Phone Number**: Contact information
- **Email**: Email address
- **Professional Expertise**: 
  - Skill level for various crop services
  - Service pricing when hired
- **Assigned Land Plots**: List of plots under worker's responsibility
- **Status**: 
  - Working (Đang làm việc)
  - Resting (đang nghỉ)
  - Other (khác)

#### Worker Calendar System
Workers must have access to a calendar showing:
- **Current Tasks**: What work is assigned
- **Duration**: How long each task should take
- **Hourly Rate**: Payment per hour
- **Crop Type**: What crops are being worked on
- **Plot Area**: Size of the assigned plot
- **Schedule**: Date, month, and specific time slots
- **Location**: Zone and land plot identification
- **Map Integration**: 
  - Clickable plot IDs to view map location
  - Visual highlighting of assigned plots to prevent confusion

### 4. Land Plot Services Management (Quản trị dịch vụ cho ô đất)

#### Service Information
- **Service Code**: Unique service identifier
- **Service Name**: Descriptive service name
- **Cost Structure**: Pricing based on plot area
- **Duration**: Time required for completion
- **Status**: 
  - In Progress (đang thực hiện)
  - Completed (đã hoàn thành)

#### Available Services
- Soil Preparation (Đào đất)
- Seed Planting (Gieo hạt)
- Watering (Tưới nước)
- Pesticide Application (Phun thuốc)
- Fertilizing (Bón phân)
- Pruning (Tỉa cành)
- Harvesting (Thu hoạch)

### 5. Calendar & Schedule Management (Quản trị calendar theo tháng)

#### Calendar Views
**A. Weekly View**:
- Display land plots in use during the week
- Show service schedules and worker assignments
- Real-time status updates

**B. Monthly/Seasonal View** (3-month seasons):
- Overview of seasonal crop planning
- Service schedule timeline
- Resource allocation overview

#### Plot Planning System
- **12 Total Plots**: Organized in 4 zones (3 plots each)
- **Flexible Crop Assignment**: 
  - Same crop can be planted in multiple plots
  - Plots can have different crops across seasons
  - Example: Plot 2 grows tomatoes in January season, carrots in April season
- **Seasonal Continuity**: Seasons can overlap across months

#### Service Scheduling Rules
- **Multiple Services Per Plot**: Allowed but no time conflicts
- **Time Slot Management**: 
  - Example: Plot 1 - Soil preparation: 10 AM to 2 PM
  - No other service can be scheduled during this time for the same plot
  - Different plots can have simultaneous services
- **Service Duration Limit**: Maximum 4 hours per service
- **Advance Planning**: Farm owners can pre-schedule future services

#### Schedule Status System

**Lock/Unlock Mechanism**:
- **Locked Status** (30+ days before season):
  - Full editing capabilities (add, edit, delete, lock plots)
  - Changes are in preview mode
  - **Save Function**: Temporary save with continued editing ability
  - **Auto-Submit**: System automatically submits 30 days before season
  - **Email Notifications**: Sent to workers after auto-submit (use free email service)
  - Calendar updates for worker viewing

- **Open Status** (30 days or less before season):
  - **No Editing Allowed**: Cannot add, edit, delete, or lock plots
  - **Worker Activities Begin**: Service execution starts
  - **Read-Only Mode**: Farm owners can only view schedules

### 6. Map System for Zones & Land Plots

#### Visual Requirements
- **Zone Color Coding**: Each zone (A, B, C, D) has distinct colors
- **Plot Color Matching**: Land plots match their zone colors
- **Address Display**: Zone addresses visible on map
- **Plot Coordinates**: Individual GPS coordinates for each plot
- **Plot Boundaries**: Clear demarcation of plot areas

#### Interactive Features
- **Hover Information**: Mouse-over displays:
  - Current crop (tomatoes, watermelon, etc.)
  - Assigned worker name and ID
  - Plot status (working/completed)
  - Status indicated by color coding rather than text

#### Reference Map Example
*Include visual map representation similar to provided image showing zone layout*

### 7. User Role System

#### Role 1: Farm Owner (Admin)
- **Full System Access**: All management functions
- **Schedule Management**: Create, edit, and monitor all schedules
- **Worker Oversight**: Assign tasks and monitor progress
- **Financial Control**: Payment approval and processing

#### Role 2: Service Worker
- **Calendar Access**: View personal work schedule
- **Status Updates**: 
  - Mark tasks as "In Progress"
  - Mark tasks as "Finished" upon completion
- **Location Information**: 
  - Access to plot locations on map
  - Visual highlighting of assigned plots
- **Task Details**: View all assignment information

### 8. Payment System

#### Payment Processing
- **24-Hour Review Period**: 
  - Payment held for farm owner feedback/verification
  - Protection against worker fraud or errors
  - Covers: not working, wrong location, false status updates
- **Automatic Payment**: 
  - If no feedback within 24 hours, system auto-pays
  - Ensures timely worker compensation
- **Payment Options**: 
  - Self-service by farm owner
  - Hired worker services (including drone services for pesticide application)

### 9. Image Management System
- **Upload Capability**: Support for land plot images
- **Image Display**: Visual representation of each plot
- **Progress Documentation**: Before/after service photos

### 10. Backend API Requirements

#### Core API Functions
- **Data Storage**: Land plot information management
- **Worker Management**: Staff and schedule handling
- **Payment Processing**: Transaction management
- **Status Updates**: Real-time plot status changes
- **User Authentication**: Secure login system
- **File Management**: Image upload and retrieval

### 11. Worker Portal Features
- **Dedicated Management Page**: Separate interface for hired workers
- **Schedule Overview**: Personal calendar and task list
- **Status Management**: Task progress tracking
- **Location Services**: Map integration for plot identification

---

## Technical Implementation Summary

### System Architecture
- **Frontend**: React-based user interface with responsive design
- **Backend**: Spring Boot RESTful API
- **Database**: MySQL or MongoDB for data persistence
- **Authentication**: Role-based access control
- **File Storage**: Image upload and management system
- **Email Integration**: Free email service for notifications
- **Map Integration**: GPS coordinate mapping system

### Key Features Recap
1. **Comprehensive Land Management**: 12 plots across 4 zones
2. **Flexible Crop Planning**: Multi-season, multi-crop capabilities
3. **Smart Scheduling**: Lock/unlock system with automated transitions
4. **Worker Coordination**: Calendar-based task assignment
5. **Payment Protection**: 24-hour review with auto-payment
6. **Visual Management**: Interactive map with color-coded status
7. **Role-Based Access**: Separate interfaces for owners and workers
8. **Service Variety**: 7 different agricultural services
9. **Real-Time Updates**: Live status tracking and notifications
10. **Historical Data**: Usage history and care records

### Success Criteria
- Efficient land plot utilization tracking
- Streamlined worker assignment and payment
- Prevention of scheduling conflicts
- Clear visual representation of farm layout
- Automated workflow management
- Secure role-based access control
- Reliable notification system
- Comprehensive reporting capabilities

This system provides complete farm management functionality with emphasis on scheduling efficiency, worker coordination, and operational transparency.