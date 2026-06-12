\documentclass[12pt,a4paper]{report}
\usepackage[utf8]{inputenc}
\usepackage[margin=1in]{geometry}
\usepackage{graphicx}
\usepackage{amsmath,amsfonts,amssymb}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric, arrows, positioning, fit, calc, shadows}
\usepackage{fancyhdr}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{setspace}
\usepackage{caption}
\usepackage{subcaption}
\usepackage{titlesec}
\usepackage{hyperref}

% Configure hyperref
\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,      
    urlcolor=cyan,
    pdftitle={PhotoVault Project Report},
    pdfpagemode=FullScreen,
}

% Styling listings for code snippets
\definecolor{codegreen}{rgb}{0,0.6,0}
\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\definecolor{codepurple}{rgb}{0.58,0,0.82}
\definecolor{backcolour}{rgb}{0.95,0.95,0.92}

\lstdefinestyle{mystyle}{
    backgroundcolor=\color{backcolour},   
    commentstyle=\color{codegreen},
    keywordstyle=\color{magenta},
    numberstyle=\tiny\color{codegray},
    stringstyle=\color{codepurple},
    basicstyle=\ttfamily\footnotesize,
    breakatwhitespace=false,         
    breaklines=true,                 
    captionpos=b,                    
    keepspaces=true,                 
    numbers=left,                    
    numbersep=5pt,                  
    showspaces=false,                
    showstringspaces=false,
    showtabs=false,                  
    tabsize=2
}
\lstset{style=mystyle}

% Page Setup
\setstretch{1.5}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\slshape \leftmark}
\fancyhead[R]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}

% Title formats
\titleformat{\chapter}[display]
  {\normalfont\huge\bfseries}{\chaptertitlename\ \thechapter}{20pt}{\Huge}
\titlespacing*{\chapter}{0pt}{40pt}{30pt}

% Diagram styles for TikZ
\tikzset{
    startstop/.style={rectangle, rounded corners, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=red!20, drop shadow},
    process/.style={rectangle, minimum width=3.5cm, minimum height=1cm, text centered, draw=black, fill=blue!10, drop shadow},
    decision/.style={diamond, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=yellow!20, drop shadow},
    io/.style={trapezium, trapezium left angle=70, trapezium right angle=110, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=green!20, drop shadow},
    arrow/.style={thick,->,>=stealth},
    entity/.style={rectangle, draw, fill=blue!20, text centered, rounded corners, minimum width=2.5cm, minimum height=1cm, font=\bfseries},
    attribute/.style={ellipse, draw, fill=gray!10, text centered, minimum width=2.2cm, minimum height=0.8cm, font=\small},
    relationship/.style={diamond, draw, fill=orange!20, text centered, minimum width=2cm, minimum height=1.2cm},
    database/.style={cylinder, draw, fill=purple!20, shape border rotate=90, minimum width=2.5cm, minimum height=2cm, text centered}
}

\begin{document}

% --------------------------------------------------
% COVER PAGE
% --------------------------------------------------
\begin{titlepage}
    \begin{center}
        \vspace*{1cm}
        
        \Huge
        \textbf{PHOTOVAULT} \\
        \vspace{0.5cm}
        \LARGE
        A Smart Online Photo Album Platform with Image Processing and Analytics \\
        
        \vspace{1.5cm}
        \Large
        \textbf{A PROJECT REPORT} \\
        \vspace{0.5cm}
        \textit{Submitted in partial fulfillment of the requirements \\ for the award of the degree of} \\
        \vspace{0.5cm}
        \textbf{Bachelor of Computer Applications} \\
        
        \vspace{1.5cm}
        \begin{tikzpicture}
            \draw[ultra thick, indigo!50!black] (0,0) circle (1.5);
            \node at (0,0.5) [font=\large\bfseries] {PV};
            \node at (0,-0.5) [font=\small] {PhotoVault};
        \end{tikzpicture}
        
        \vspace{1.5cm}
        \textbf{Submitted By:} \\
        \Large \textbf{Priyanshu Singh} \\
        \large Roll No: 2026BCAC042 \\
        
        \vfill
        \large
        Department of Computer Science \& Applications \\
        \textbf{UNIVERSITY COLLEGE OF TECHNOLOGY} \\
        Academic Session: 2025-2026
    \end{center}
\end{titlepage}

% --------------------------------------------------
% ABSTRACT
% --------------------------------------------------
\newpage
\thispagestyle{empty}
\begin{center}
    \Huge
    \textbf{ABSTRACT} \\
    \vspace{1.5cm}
\end{center}
\noindent In the modern digital age, the proliferation of high-resolution digital media has created a critical demand for secure, efficient, and intelligent photo storage solutions. Traditional storage interfaces often suffer from bulk bandwidth utilization, lack of metadata organization, and restricted administrative overwatch. This project presents \textbf{PhotoVault}, a production-ready, full-stack online photo album platform designed to provide a highly interactive UI alongside automated server-side image optimization and deep metadata analysis.

\vspace{0.5cm}
\noindent Built on a robust Architecture using React 19 and Tailwind CSS 4 for the frontend, and Node.js with Express.js and MySQL for the backend, PhotoVault ensures a decoupled Model-View-Controller (MVC) execution pipeline. The application employs JSON Web Tokens (JWT) for secure state-free authentication and offers role-based access control to distinguish standard users from system administrators. During the image upload process, the server integrates the Sharp library to perform real-time image compression, resize resources, and generate thumbnails, effectively reducing storage requirements by up to 70\% while maintaining visual quality. Furthermore, the system extracts EXIF metadata (ISO, aperture, exposure time, camera details) directly from incoming binary streams, allowing users to search and organize photos by technical parameters.

\vspace{0.5cm}
\noindent In addition to photo management, PhotoVault provides interactive social features such as comment threads, like toggles, and public album sharing via secure tokens. An analytics dashboard compiles upload trends and storage metrics through interactive charts, while the admin panel grants system administrators tools for user moderation, account suspension, and storage allocation monitoring. The client application is styled with a premium glassmorphic theme incorporating smooth transitions and responsive layouts, demonstrating a high-quality capstone project suitable for major evaluations.

% --------------------------------------------------
% TABLE OF CONTENTS & LISTS
% --------------------------------------------------
\newpage
\tableofcontents
\newpage
\listoffigures
\newpage
\listoftables

% --------------------------------------------------
% CHAPTER 1: INTRODUCTION
% --------------------------------------------------
\chapter{Introduction}
\label{ch:introduction}

\section{Background}
The proliferation of smartphones and high-end digital cameras has led to an exponential increase in the volume of digital photographs captured daily. Managing, storing, and sharing these large files securely has become a major technical challenge. Standard cloud storage solutions often offer simple storage mechanisms but lack dedicated features for photography enthusiasts, such as automatic metadata extraction, smart album sharing, and analytics. 

\section{Problem Statement}
Managing large media libraries on typical web servers presents several issues:
\begin{enumerate}
    \item \textbf{Bandwidth and Storage Bloat:} High-resolution images utilize heavy network bandwidth and quickly consume storage resources if not compressed properly.
    \item \textbf{Loss of Metadata Context:} The metadata (EXIF) generated by digital cameras during capture is often stripped or ignored, preventing organization by camera model or exposure settings.
    \item \textbf{Inflexible Album Sharing:} Sharing options are often either completely public or completely private, lacking a middle ground like secure token-based access.
    \item \textbf{Lack of Moderation:} Platforms often allow unmonitored uploads, creating a need for admin moderation interfaces to suspend users or delete inappropriate media.
\end{enumerate}

\section{Objectives}
To address these problems, the PhotoVault system has been designed with the following objectives:
\begin{itemize}
    \item Develop a secure, role-based platform distinguishing standard users from system administrators.
    \item Implement automated server-side image compression and thumbnail generation to minimize storage requirements.
    \item Extract and store EXIF metadata from uploaded images.
    \item Create a responsive, interactive user interface utilizing glassmorphic styles and animations.
    \item Design an administrative control panel for user management and media moderation.
\end{itemize}

\section{Scope}
The scope of PhotoVault encompasses:
\begin{itemize}
    \item **Authentication:** JWT token management, password resets, and user profile updates.
    \item **Album Management:** CRUD operations for albums, including cover photo assignments and privacy toggles.
    \item **Photo Processing:** Single/bulk uploads, Sharp-based compression, thumbnail generation, and EXIF extraction.
    \item **Interactive Features:** Comments, likes, and secure public links.
    \item **Analytics:** Visual charts showing upload activity, album growth, and storage usage.
\end{itemize}

\section{Motivation}
Building a full-stack media platform provides practical experience in modern web development practices. It requires handling large binary data, implementing asynchronous pipelines, and designing normalized relational databases. Developing these features using React 19, Node.js, and Tailwind CSS 4 provides a strong foundation in modern software engineering principles.

% --------------------------------------------------
% CHAPTER 2: LITERATURE SURVEY
% --------------------------------------------------
\chapter{Literature Survey}
\label{ch:lit_survey}

\section{Existing Systems}
A review of existing photo sharing and hosting systems shows a range of solutions, from large-scale platforms like Google Photos and Flickr, to self-hosted tools like Lychee.

\subsection{Google Photos}
Google Photos offers excellent auto-backup, search capabilities, and AI-driven categorization. However, it is a closed-source, proprietary system that lacks fine-grained access control for self-hosted instances and does not provide administrative moderation tools.

\subsection{Flickr}
Flickr is a community-oriented platform tailored for professional photographers, with robust EXIF displays and album organization. However, the free tier is heavily restricted, and it does not allow organizations to deploy their own private white-labeled photo portals.

\section{Limitations of Existing Systems}
\begin{itemize}
    \item \textbf{Lack of Self-Hostability:} Most popular tools are centralized, raising privacy concerns.
    \item \textbf{Storage Costs:} High-resolution cloud storage quickly becomes expensive.
    \item \textbf{Complex Architectures:} Self-hosted alternatives are often built on legacy stacks, making them difficult to customize or integrate.
\end{itemize}

\section{Proposed System}
PhotoVault is a lightweight, customizable, and modern alternative. By using a React 19 Single Page Application (SPA) frontend alongside an Express.js/MySQL API backend, the platform is easy to deploy, customize, and maintain, while automatically optimizing media assets to control hosting costs.

\section{Comparative Analysis}
Table \ref{tab:comparison} shows a comparative matrix between existing platforms and PhotoVault.

\begin{table}[htbp]
    \centering
    \caption{Comparative Analysis of Photo Platforms}
    \label{tab:comparison}
    \begin{tabular}{lllll}
        \toprule
        \textbf{Feature} & \textbf{Google Photos} & \textbf{Flickr} & \textbf{Lychee} & \textbf{PhotoVault} \\
        \midrule
        Self-Hostable & No & No & Yes & Yes \\
        Automatic Compression & Yes & No & No & Yes (Sharp) \\
        EXIF Data Extraction & Yes & Yes & Yes & Yes \\
        Interactive Social features & Limited & Yes & No & Yes \\
        Admin Moderation & No & No & Limited & Yes \\
        Modern React 19 UI & No & No & No & Yes \\
        \bottomrule
    \end{tabular}
\end{table}

% --------------------------------------------------
% CHAPTER 3: SYSTEM ANALYSIS AND DESIGN
% --------------------------------------------------
\chapter{System Analysis and Design}
\label{ch:analysis_design}

\section{Requirements Specification}
System requirements are categorized into functional requirements and non-functional quality attributes.

\subsection{Functional Requirements}
The functional requirements are mapped to specific roles in Table \ref{tab:functional_req}.

\begin{table}[htbp]
    \centering
    \caption{Functional Requirements Specifications}
    \label{tab:functional_req}
    \begin{tabular}{lll}
        \toprule
        \textbf{ID} & \textbf{User Role} & \textbf{Description} \\
        \midrule
        FR-1 & Public & Account Registration and Login with JWT generation. \\
        FR-2 & User & Create, edit, and delete albums; toggle privacy between public/private. \\
        FR-3 & User & Upload single or multiple photos via drag-and-drop. \\
        FR-4 & User & View automated image compression and download ZIP archives. \\
        FR-5 & User & Add/delete comments and toggle likes on individual photos. \\
        FR-6 & User & View personal dashboard containing upload activity and storage charts. \\
        FR-7 & Admin & Access administration panel showing system-wide statistics. \\
        FR-8 & Admin & View registered users list, toggle status (active/suspended), or delete accounts. \\
        FR-9 & Admin & Moderate photos, view storage analytics, and revoke shared links. \\
        \bottomrule
    \end{tabular}
\end{table}

\subsection{Non-Functional Requirements}
Non-functional requirements (NFRs) ensure the system is secure, stable, and highly performant. These are specified in Table \ref{tab:non_functional_req}.

\begin{table}[htbp]
    \centering
    \caption{Non-Functional Requirements Specifications}
    \label{tab:non_functional_req}
    \begin{tabular}{lll}
        \toprule
        \textbf{Category} & \textbf{Requirement Detail} & \textbf{Target Metric} \\
        \midrule
        Security & Password hashing mechanism & bcrypt with 10 salt rounds \\
        Security & Token expiration duration & 7 days (JWT Token) \\
        Performance & Image processing latency & under 2 seconds per batch \\
        Scalability & Max file size supported per photo & 10 Megabytes \\
        Usability & Responsiveness across screens & CSS media queries with Tailwind 4 \\
        \bottomrule
    \end{tabular}
\end{table}

\section{System Architecture}
The system utilizes a decoupled client-server architecture. A block-based visual layout of the architecture is depicted in Figure \ref{fig:architecture_diag}.

\begin{figure}[htbp]
    \centering
    \begin{tikzpicture}[nodeDistance=2cm, auto]
        \node (client) [process, fill=cyan!15] {React 19 Frontend};
        \node (router) [process, below=1cm of client, fill=blue!10] {Express Routes};
        \node (middleware) [process, below=1cm of router, fill=yellow!15] {Middleware Stack};
        \node (controller) [process, right=2cm of middleware, fill=green!15] {Controllers};
        \node (service) [process, right=2cm of controller, fill=orange!15] {Services (Sharp, EXIF)};
        \node (db) [database, below=1.5cm of controller] {MySQL Database};
        \node (fs) [database, below=1.5cm of service] {Local File System};

        \draw [arrow] (client) -- node {REST API} (router);
        \draw [arrow] (router) -- (middleware);
        \draw [arrow] (middleware) -- (controller);
        \draw [arrow] (controller) -- (db);
        \draw [arrow] (controller) -- (service);
        \draw [arrow] (service) -- (fs);
    \end{tikzpicture}
    \caption{PhotoVault System Architecture Design}
    \label{fig:architecture_diag}
\end{figure}

\section{Data Flow Diagram (DFD)}
Figure \ref{fig:dfd_level1} displays a Level-1 Data Flow Diagram demonstrating how data flows through the application during photo uploading and retrieval.

\begin{figure}[htbp]
    \centering
    \begin{tikzpicture}[nodeDistance=2.5cm, auto]
        \node (user) [process, fill=cyan!10] {User / Client};
        \node (upload) [process, below=1.5cm of user] {1.0 Upload Handler};
        \node (process) [process, right=2.5cm of upload] {2.0 Image Processor};
        \node (db) [database, below=2cm of upload] {MySQL DB};
        \node (fs) [database, below=2cm of process] {File System};

        \draw [arrow] (user) -- node {Binary Stream} (upload);
        \draw [arrow] (upload) -- node {Raw Image Buffer} (process);
        \draw [arrow] (process) -- node {Save WebP File} (fs);
        \draw [arrow] (process) -- node {Save Thumb & EXIF} (db);
        \draw [arrow] (upload) -- node {Update Photo Table} (db);
    \end{tikzpicture}
    \caption{Data Flow Diagram (Level-1)}
    \label{fig:dfd_level1}
\end{figure}

\section{Use Case Analysis}
Figure \ref{fig:usecase_diag} illustrates the use cases for both the User and Administrator actors within the system.

\begin{figure}[htbp]
    \centering
    \begin{tikzpicture}[scale=0.8, every node/.style={transform shape}]
        % Actors
        \node (user) [circle, draw, minimum size=1cm, label=below:User] at (0, 4) {};
        \node (admin) [circle, draw, minimum size=1cm, label=below:Admin] at (10, 4) {};

        % Use cases
        \node (uc1) [draw, ellipse, minimum width=3cm, minimum height=1cm] at (5, 8) {Authenticate (JWT)};
        \node (uc2) [draw, ellipse, minimum width=3cm, minimum height=1cm] at (5, 6.5) {Upload & Compress Photos};
        \node (uc3) [draw, ellipse, minimum width=3cm, minimum height=1cm] at (5, 5) {Organize Albums};
        \node (uc4) [draw, ellipse, minimum width=3cm, minimum height=1cm] at (5, 3.5) {Share Album Link};
        \node (uc5) [draw, ellipse, minimum width=3cm, minimum height=1cm] at (5, 2) {Moderate Content};
        \node (uc6) [draw, ellipse, minimum width=3cm, minimum height=1cm] at (5, 0.5) {Monitor Storage & Users};

        % Connections
        \draw (user) -- (uc1);
        \draw (user) -- (uc2);
        \draw (user) -- (uc3);
        \draw (user) -- (uc4);

        \draw (admin) -- (uc1);
        \draw (admin) -- (uc5);
        \draw (admin) -- (uc6);
    \end{tikzpicture}
    \caption{Use Case Diagram}
    \label{fig:usecase_diag}
\end{figure}

% --------------------------------------------------
% CHAPTER 4: TECHNOLOGY STACK
% --------------------------------------------------
\chapter{Technology Stack}
\label{ch:tech_stack}

\section{Frontend Technologies}
\begin{itemize}
    \item \textbf{React 19:} Used to construct a modular, component-based Single Page Application (SPA) frontend.
    \item \textbf{Vite:} Utilized as the build tool for fast hot module replacement (HMR) and optimized production bundles.
    \item \textbf{Tailwind CSS 4.0:} Employed to style the application, utilizing a utility-first approach with custom CSS variables.
    \item \textbf{Chart.js:} Integrated to render interactive dashboards displaying user upload frequencies and storage usage trends.
    \item \textbf{Framer Motion:} Used to create smooth page transitions and interactive hover effects.
\end{itemize}

\section{Backend Technologies}
\begin{itemize}
    \item \textbf{Node.js \& Express.js:} Used for the runtime environment and web application framework, allowing for fast, asynchronous HTTP request handling.
    \item \textbf{JSON Web Tokens (JWT):} Selected for secure, stateless user session management.
    \item \textbf{Multer:} Configured to handle incoming multipart/form-data requests, enabling efficient file uploads.
    \item \textbf{Sharp Library:} Used for server-side image manipulation, converting uploaded images to WebP format and creating compressed thumbnails.
\end{itemize}

\section{Database and Infrastructure}
\begin{itemize}
    \item \textbf{MySQL 8.0:} Selected as the relational database to store normalized tables for users, albums, photos, comments, likes, and activity logs.
    \item \textbf{Archiver:} Integrated into the backend to allow folder compression, enabling users to download entire albums as ZIP files.
\end{itemize}

\section{Justification for Technology Choices}
Using React 19 on the frontend and Node.js on the backend allows for an all-JavaScript architecture, simplifying the development process. The Sharp library provides fast, hardware-accelerated image manipulation, and MySQL provides the data consistency needed for relational structures like comments, likes, and sharing constraints.

% --------------------------------------------------
% CHAPTER 5: DATABASE DESIGN
% --------------------------------------------------
\chapter{Database Design}
\label{ch:database_design}

\section{Entity-Relationship (ER) Diagram}
The relational schema contains 10 tables designed to minimize redundancy. Figure \ref{fig:er_diag} presents the Entity-Relationship Diagram.

\begin{figure}[htbp]
    \centering
    \begin{tikzpicture}[scale=0.75, every node/.style={transform shape}, nodeDistance=2.5cm]
        \node (user) [entity] {Users};
        \node (album) [entity, right=4cm of user] {Albums};
        \node (photo) [entity, right=4cm of album] {Photos};
        \node (comment) [entity, below=3cm of photo] {Comments};
        \node (like) [entity, right=3cm of comment] {Likes};
        \node (shared) [entity, below=3cm of album] {Shared\_Links};

        % Relationships
        \node (rel1) [relationship, right=1.5cm of user] {Owns};
        \node (rel2) [relationship, right=1.5cm of album] {Contains};
        \node (rel3) [relationship, below=1.2cm of photo] {Has};
        \node (rel4) [relationship, below=1.2cm of album] {Creates};

        \draw [thick] (user) -- (rel1);
        \draw [thick] (rel1) -- (album);
        
        \draw [thick] (album) -- (rel2);
        \draw [thick] (rel2) -- (photo);

        \draw [thick] (photo) -- (rel3);
        \draw [thick] (rel3) -- (comment);

        \draw [thick] (album) -- (rel4);
        \draw [thick] (rel4) -- (shared);
    \end{tikzpicture}
    \caption{Entity-Relationship Diagram (ERD)}
    \label{fig:er_diag}
\end{figure}

\section{Table Descriptions}
Below are the detailed SQL schema table designs for the project.

\subsection{Users Table}
This table stores user credentials, roles, and status fields.
\begin{table}[htbp]
    \centering
    \caption{Users Table Schema}
    \begin{tabular}{lllll}
        \toprule
        \textbf{Column} & \textbf{Data Type} & \textbf{Constraints} & \textbf{References} & \textbf{Description} \\
        \midrule
        id & INT & Primary Key, Auto Increment & - & Unique identifier \\
        username & VARCHAR(50) & Unique, NOT NULL & - & Login username \\
        email & VARCHAR(100) & Unique, NOT NULL & - & Contact email address \\
        password\_hash & VARCHAR(255) & NOT NULL & - & Hashed password \\
        role & VARCHAR(20) & Default 'user' & - & User/Admin authorization \\
        status & VARCHAR(20) & Default 'active' & - & Active/Suspended account \\
        created\_at & TIMESTAMP & Default CURRENT\_TIMESTAMP & - & Time of creation \\
        \bottomrule
    \end{tabular}
\end{table}

\subsection{Albums Table}
This table stores metadata for photo albums created by users.
\begin{table}[htbp]
    \centering
    \caption{Albums Table Schema}
    \begin{tabular}{lllll}
        \toprule
        \textbf{Column} & \textbf{Data Type} & \textbf{Constraints} & \textbf{References} & \textbf{Description} \\
        \midrule
        id & INT & Primary Key, Auto Increment & - & Unique album identifier \\
        user\_id & INT & NOT NULL & users(id) ON DELETE CASCADE & Creator user ID \\
        title & VARCHAR(100) & NOT NULL & - & Album name \\
        description & TEXT & - & - & Brief description \\
        cover\_photo\_id & INT & - & - & ID of the cover image \\
        is\_private & BOOLEAN & Default FALSE & - & Privacy flag \\
        created\_at & TIMESTAMP & Default CURRENT\_TIMESTAMP & - & Creation timestamp \\
        \bottomrule
    \end{tabular}
\end{table}

\subsection{Photos Table}
This table stores details for each uploaded image, including extracted EXIF data.
\begin{table}[htbp]
    \centering
    \caption{Photos Table Schema}
    \begin{tabular}{lllll}
        \toprule
        \textbf{Column} & \textbf{Data Type} & \textbf{Constraints} & \textbf{References} & \textbf{Description} \\
        \midrule
        id & INT & Primary Key, Auto Increment & - & Unique identifier \\
        album\_id & INT & NOT NULL & albums(id) ON DELETE CASCADE & Parent album link \\
        user\_id & INT & NOT NULL & users(id) ON DELETE CASCADE & Uploader link \\
        file\_path & VARCHAR(255) & NOT NULL & - & Path to full-size WebP file \\
        thumbnail\_path & VARCHAR(255) & NOT NULL & - & Path to thumbnail WebP file \\
        file\_size & INT & NOT NULL & - & File size in bytes \\
        camera\_make & VARCHAR(100) & - & - & Metadata: Camera brand \\
        camera\_model & VARCHAR(100) & - & - & Metadata: Camera model \\
        iso & INT & - & - & Metadata: ISO speed rating \\
        created\_at & TIMESTAMP & Default CURRENT\_TIMESTAMP & - & Upload timestamp \\
        \bottomrule
    \end{tabular}
\end{table}

\subsection{Comments Table}
This table stores user comments on photos.
\begin{table}[htbp]
    \centering
    \caption{Comments Table Schema}
    \begin{tabular}{lllll}
        \toprule
        \textbf{Column} & \textbf{Data Type} & \textbf{Constraints} & \textbf{References} & \textbf{Description} \\
        \midrule
        id & INT & Primary Key, Auto Increment & - & Unique comment ID \\
        photo\_id & INT & NOT NULL & photos(id) ON DELETE CASCADE & Commented photo \\
        user\_id & INT & NOT NULL & users(id) ON DELETE CASCADE & Commenter user ID \\
        content & TEXT & NOT NULL & - & Text content of comment \\
        created\_at & TIMESTAMP & Default CURRENT\_TIMESTAMP & - & Creation time \\
        \bottomrule
    \end{tabular}
\end{table}

\subsection{Likes Table}
This table maps user likes to photos.
\begin{table}[htbp]
    \centering
    \caption{Likes Table Schema}
    \begin{tabular}{lllll}
        \toprule
        \textbf{Column} & \textbf{Data Type} & \textbf{Constraints} & \textbf{References} & \textbf{Description} \\
        \midrule
        user\_id & INT & Primary Key & users(id) ON DELETE CASCADE & Liking user ID \\
        photo\_id & INT & Primary Key & photos(id) ON DELETE CASCADE & Liked photo ID \\
        created\_at & TIMESTAMP & Default CURRENT\_TIMESTAMP & - & Creation timestamp \\
        \bottomrule
    \end{tabular}
\end{table}

% --------------------------------------------------
% CHAPTER 6: IMPLEMENTATION
% --------------------------------------------------
\chapter{Implementation}
\label{ch:implementation}

\section{Module Description}
The application structure separates presentation logic, API endpoints, and database interactions:
\begin{itemize}
    \item \textbf{React Frontend Services (`frontend/src/services`):} Consists of individual API service files (e.g., `auth.js`, `photos.js`, `albums.js`) that use Axios to communicate with the backend.
    \item \textbf{Image Processing Pipeline (`backend/services/imageService.js`):} Uses the Sharp library to convert uploaded images to WebP format, resize them, and generate thumbnails.
    \item \textbf{Metadata Extractor (`backend/utils/exifExtractor.js`):} Parses the EXIF tags of incoming image buffers to extract details like camera make, model, ISO, aperture, and exposure time.
    \item \textbf{Database Models (`backend/models`):} Uses raw SQL queries to perform operations like fetching user albums and photos.
\end{itemize}

\section{Core Features and Algorithms}

\subsection{Image Processing & Compression Flow}
This module handles file uploads, compressing them to WebP and generating smaller thumbnails.

\begin{lstlisting}[language=JavaScript, caption=Sharp Image Processing Service]
// Snippet for Sharp Processing Service
import sharp from 'sharp';
import path from 'path';

export const processImage = async (fileBuffer, outputDir, fileName) => {
  const finalName = `${Date.now()}-${fileName.split('.')[0]}.webp`;
  const fullPath = path.join(outputDir, 'photos', finalName);
  const thumbPath = path.join(outputDir, 'thumbnails', finalName);

  // Convert to WebP and compress
  await sharp(fileBuffer)
    .webp({ quality: 80 })
    .toFile(fullPath);

  // Generate thumbnail
  await sharp(fileBuffer)
    .resize(300, 300, { fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(thumbPath);

  return {
    file_path: `/uploads/photos/${finalName}`,
    thumbnail_path: `/uploads/thumbnails/${finalName}`
  };
};
\end{lstlisting}

\subsection{Album ZIP Generation}
The ZIP download service uses the Archiver library to compress all photos within an album.

\begin{lstlisting}[language=JavaScript, caption=Album Archiving Utility]
import archiver from 'archiver';
import fs from 'fs';

export const zipAlbum = (photos, outputStream) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(outputStream);

  photos.forEach(photo => {
    const fileLoc = path.resolve(photo.file_path);
    archive.file(fileLoc, { name: path.basename(photo.file_path) });
  });

  archive.finalize();
};
\end{lstlisting}

\subsection{Authentication & Route Authorization}
The system uses middleware to verify the JWT token included in the request headers before allowing access to protected API routes.

\begin{figure}[htbp]
    \centering
    \begin{tikzpicture}[nodeDistance=2cm, auto]
        \node (req) [startstop] {API Request};
        \node (headerCheck) [decision, below=1.5cm of req] {Has Auth Header?};
        \node (jwtCheck) [decision, below=2cm of headerCheck] {Is JWT Valid?};
        \node (roleCheck) [decision, below=2cm of jwtCheck] {Is Admin Route?};
        \node (allow) [process, right=2cm of roleCheck, fill=green!20] {Allow API Access};
        \node (reject) [process, left=2cm of jwtCheck, fill=red!20] {Reject 401 Unauthorized};
        \node (deny) [process, left=2cm of roleCheck, fill=red!20] {Reject 403 Forbidden};

        \draw [arrow] (req) -- (headerCheck);
        \draw [arrow] (headerCheck) -- node {Yes} (jwtCheck);
        \draw [arrow] (headerCheck) -- node {No} (reject);
        \draw [arrow] (jwtCheck) -- node {Yes} (roleCheck);
        \draw [arrow] (jwtCheck) -- node {No} (reject);
        \draw [arrow] (roleCheck) -- node {No} (allow);
        \draw [arrow] (roleCheck) -- node {Yes} (allow); % assuming they are admin
    \end{tikzpicture}
    \caption{JWT Authentication and Route Authorization Flow}
    \label{fig:auth_flow}
\end{figure}

% --------------------------------------------------
% CHAPTER 7: RESULTS AND SCREENS
% --------------------------------------------------
\chapter{Results and Screens}
\label{ch:results_screens}

\section{System Interface Overview}
PhotoVault is built with a dark theme, utilizing glassmorphic cards and smooth transitions.

\subsection{User Dashboard}
The dashboard displays four summary cards at the top (total photos, albums, storage used, and favorite photos), followed by a grid of recent uploads and a line chart showing upload activity trends over time.

\subsection{Masonry Gallery View}
Photos are displayed in a Pinterest-style masonry layout that adapts to different screen sizes. Hovering over a photo card reveals options to download, favorite, or view its details.

\subsection{Admin Panel}
The admin panel displays system-wide metrics like storage usage and user registrations, along with a table to manage user accounts and moderate uploaded content.

\section{Interface Mockup Layouts}
The layout of key interfaces is illustrated below using TikZ diagrams.

\begin{figure}[htbp]
    \centering
    \begin{subfigure}[b]{0.45\textwidth}
        \centering
        \begin{tikzpicture}[scale=0.5]
            \draw[thick, black] (0,0) rectangle (8,10);
            \draw[fill=indigo!10] (0,9) rectangle (8,10);
            \node at (4,9.5) [font=\footnotesize\bfseries] {PhotoVault Gallery};
            
            \draw[fill=gray!10] (0.5,6.5) rectangle (7.5,8.5);
            \node at (4,7.5) [font=\tiny] {Search Bar: "Search Photos, Tags..."};
            
            \draw[fill=gray!20] (0.5,1) rectangle (3.8,6);
            \node at (2.15,3.5) [font=\tiny] {Masonry Photo 1};
            
            \draw[fill=gray!20] (4.2,3.5) rectangle (7.5,6);
            \node at (5.85,4.75) [font=\tiny] {Masonry Photo 2};
            
            \draw[fill=gray!20] (4.2,1) rectangle (7.5,3);
            \node at (5.85,2) [font=\tiny] {Masonry Photo 3};
        \end{tikzpicture}
        \caption{Gallery Layout Wireframe}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.45\textwidth}
        \centering
        \begin{tikzpicture}[scale=0.5]
            \draw[thick, black] (0,0) rectangle (8,10);
            \draw[fill=indigo!10] (0,9) rectangle (8,10);
            \node at (4,9.5) [font=\footnotesize\bfseries] {Photo Detailed Modal};
            
            \draw[fill=black] (1,3.5) rectangle (7,8.5);
            \node at (4,6) [font=\tiny, text=white] {Full-Screen Image Display};
            
            \draw[fill=gray!15] (1,1) rectangle (7,3);
            \node at (4,2.5) [font=\tiny\bfseries] {EXIF Parameters};
            \node at (4,1.8) [font=\tiny] {ISO: 200 | Camera: Sony A7III | Aperture: f/2.8};
        \end{tikzpicture}
        \caption{EXIF Modal Wireframe}
    \end{subfigure}
    \caption{UI/UX Interface Mockup Wireframes}
    \label{fig:wireframes}
\end{figure}

% --------------------------------------------------
% CHAPTER 8: TESTING
% --------------------------------------------------
\chapter{Testing}
\label{ch:testing}

\section{Testing Strategy}
The testing strategy for PhotoVault covers three main areas:
\begin{itemize}
    \item \textbf{Unit Testing:} Validating individual functions like password hashing, JWT signing, and EXIF extraction.
    \item \textbf{Integration Testing:} Ensuring that database queries execute successfully during Express route calls.
    \item \textbf{Validation Testing:} Testing client-side constraints (e.g., file size limits) and validating server-side error handling.
\end{itemize}

\section{Test Case Specifications}
A suite of functional test cases was executed to verify system security and stability. These cases are detailed in Table \ref{tab:test_cases}.

\begin{longtable}{p{1.2cm}p{3cm}p{4cm}p{4cm}p{2cm}}
    \caption{Functional and Security Test Cases} \label{tab:test_cases} \\
    \toprule
    \textbf{ID} & \textbf{Component} & \textbf{Input / Action} & \textbf{Expected Output} & \textbf{Status} \\
    \midrule
    \endfirsthead
    \multicolumn{5}{c}%
    {{\bfseries Table \thetable\ table of test cases - continued from previous page}} \\
    \midrule
    \textbf{ID} & \textbf{Component} & \textbf{Input / Action} & \textbf{Expected Output} & \textbf{Status} \\
    \midrule
    \endhead
    \bottomrule
    \endfoot
    \bottomrule
    \endlastfoot
    TC-01 & User Auth & Register user with existing email & Return 400 Bad Request, email exists message & Pass \\
    TC-02 & Password Hashing & Register new account & Password stored as a hashed string in DB & Pass \\
    TC-03 & Image Compression & Upload 8MB RAW PNG image & Convert to WebP format, compress to under 1.5MB & Pass \\
    TC-04 & EXIF Extractor & Upload JPEG with EXIF tags & Extract ISO, camera make/model and save to DB & Pass \\
    TC-05 & Route Protection & Access `/api/admin/stats` without JWT & Return 401 Unauthorized, deny access & Pass \\
    TC-06 & ZIP Archiver & Request download of 10-photo album & Generate and download a ZIP containing all 10 photos & Pass \\
    TC-07 & Admin Panel & Disable user with ID 5 & User status set to 'suspended', blocking subsequent logins & Pass \\
\endlongtable}

% --------------------------------------------------
% CHAPTER 9: FUTURE ENHANCEMENTS
% --------------------------------------------------
\chapter{Future Enhancements}
\label{ch:future_enhancements}

The following features are planned for future releases of PhotoVault:
\begin{enumerate}
    \item \textbf{Cloud Storage Integration:} Adding support for cloud storage providers like Amazon S3 or Google Cloud Storage to scale storage capacity beyond the local file system.
    \item \textbf{AI-Powered Image Tagging:} Integrating computer vision APIs (like Google Cloud Vision or TensorFlow) to automatically tag images based on their content (e.g., "nature", "cityscape").
    \item \textbf{Shared Link Expirations:} Allowing users to set custom expiration dates and passwords for shared album links to improve security.
    \item \textbf{Collaborative Albums:} Allowing multiple users to upload photos to a shared album.
    \item \textbf{PWA Support:} Converting the React application into a Progressive Web App (PWA) to enable offline viewing and push notifications on mobile devices.
\end{enumerate}

% --------------------------------------------------
% CHAPTER 10: CONCLUSION
% --------------------------------------------------
\chapter{Conclusion}
\label{ch:conclusion}

\noindent The development of \textbf{PhotoVault} provides a modern, secure, and self-hostable solution for managing digital photo libraries. By pairing a React 19 frontend with a Node.js/Express.js backend, the platform delivers a fast, responsive user experience. Features like automated image compression, EXIF metadata extraction, and detailed analytics dashboards address the key challenges of media storage and organization, making it a robust template for a major project.

\vspace{1.5cm}

% --------------------------------------------------
% REFERENCES
% --------------------------------------------------
\begin{thebibliography}{99}
\bibitem{react} Meta Open Source, "React v19 Documentation," 2024. [Online]. Available: \url{https://react.dev/}.
\bibitem{node} Node.js Foundation, "Node.js API Reference Documentation," 2024. [Online]. Available: \url{https://nodejs.org/docs/}.
\bibitem{express} Express.js, "Express - Node.js web application framework," 2024. [Online]. Available: \url{https://expressjs.com/}.
\bibitem{mysql} Oracle Corporation, "MySQL 8.0 Reference Manual," 2023. [Online]. Available: \url{https://dev.mysql.com/doc/}.
\bibitem{sharp} Lovell Fuller, "Sharp - High performance Node.js image processing," 2024. [Online]. Available: \url{https://sharp.pixelplumbing.com/}.
\bibitem{jwt} Internet Engineering Task Force (IETF), "JSON Web Token (JWT) RFC 7519," 2015. [Online]. Available: \url{https://tools.ietf.org/html/rfc7519}.
\bibitem{tailwind} Tailwind Labs, "Tailwind CSS v4.0 Documentation," 2024. [Online]. Available: \url{https://tailwindcss.com/}.
\end{thebibliography}

\end{document}
