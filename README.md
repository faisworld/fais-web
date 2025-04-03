# Admin Panel

The `/admin` directory contains the code for the admin panel of the application. This panel provides tools for managing pages, components, galleries, and users. It also includes a dashboard with widgets and analytics.

---

## Structure

The admin panel is structured as follows:

### **1. Layout**
- **File:** `layout.tsx`
- **Description:** 
  - Defines the overall layout of the admin panel.
  - Includes a sidebar navigation menu and a main content area.
  - Manages the `activeMenu` and `activeSubMenu` states for navigation.

### **2. Pages**
#### **Dashboard**
- **File:** `dashboard/page.tsx`
- **Description:** 
  - Displays an overview of the admin panel.
  - Includes:
    - Widgets for displaying statistics (e.g., total pages, users, media).
    - Placeholder blocks for future widgets or analytics.

#### **Pages**
- **Directory:** `pages/`
- **Subpages:**
  - **All Pages**
    - **File:** `all-pages/page.tsx`
    - **Description:** Lists all pages with options to view, edit, duplicate, or delete pages. Allows managing page components dynamically.
  - **Create Page**
    - **File:** `create-page/page.tsx`
    - **Description:** Provides a form to create new pages with fields for title, slug, description, meta title, and meta description. Includes a "Preview" button to preview the page before saving.
  - **Page Components**
    - **File:** `page-components/page.tsx`
    - **Description:** Allows managing and editing reusable components for pages. Displays a list of components for each page and provides functionality to edit their configurations.

#### **Gallery**
- **File:** `gallery/gallery.tsx`
- **Description:** Placeholder for managing and displaying images from the `public/images` directory.

#### **Users**
- **File:** `users/page.tsx`
- **Description:** Placeholder for managing users. Will be connected to a PostgreSQL database via Neon and Vercel in the future.

---

## Sidebar Navigation

The sidebar navigation menu includes the following items:

1. **Dashboard**
   - Displays the dashboard with widgets and analytics.
2. **Pages**
   - **All Pages:** View a list of all pages with options to edit, duplicate, or delete.
   - **Create Page:** Create a new page using the page creation form.
   - **Page Components:** Manage and edit reusable components for pages.
3. **Gallery**
   - Manage and display images from the `public/images` directory.
4. **Users**
   - Manage users (to be implemented later).
5. **Settings**
   - Placeholder for managing application settings.

---

## Main Content Area

The main content area dynamically updates based on the selected menu item. Each menu item corresponds to a specific page or functionality.

---

## Future Enhancements

1. **Gallery Integration**
   - Dynamically load and display images from the `public/images` directory.

2. **User Management**
   - Connect to a PostgreSQL database via Neon and Vercel for managing users.

3. **Styling**
   - Enhance the UI with additional styling and interactivity.

4. **Analytics**
   - Add widgets and analytics to the dashboard.

5. **Duplicate and Delete Pages**
   - Add functionality to duplicate and delete pages in the "All Pages" section.

6. **Preview Pages**
   - Allow previewing pages before saving them in the "Create Page" section.

---

## How to Use

1. Navigate to the `/admin` route in your application.
2. Use the sidebar to switch between different sections of the admin panel.
3. Use the "Create Page" section to add new pages to the website.
4. Manage components, galleries, and users through their respective sections.

---

## File Structure

```
/admin
├── dashboard/
│   └── page.tsx            # Dashboard page
├── gallery/
│   └── gallery.tsx         # Gallery management page
├── layout.tsx              # Admin panel layout with sidebar
├── pages/
│   ├── all-pages/
│   │   └── page.tsx        # List all pages
│   ├── create-page/
│   │   └── page.tsx        # Page creation form
│   ├── page-components/
│   │   └── page.tsx        # Page components management page
├── users/
│   └── page.tsx            # User management page
├── LICENSE                 # License file
├── README.md               # Documentation for the admin panel
└── pagesData.json          # JSON file storing page data
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.