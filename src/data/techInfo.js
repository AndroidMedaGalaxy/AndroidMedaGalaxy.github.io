// Technology information for tooltips/popups
export const techInfo = {
  // Languages
  'Kotlin': {
    name: 'Kotlin',
    description: 'Modern, concise programming language for Android development. Fully interoperable with Java, offering null safety, coroutines, and expressive syntax.',
    category: 'Language',
    color: 'from-purple-500 to-pink-500'
  },
  'Java': {
    name: 'Java',
    description: 'Object-oriented programming language and foundation of Android development. Known for platform independence and robust enterprise applications.',
    category: 'Language',
    color: 'from-red-500 to-orange-500'
  },
  'Android': {
    name: 'Android',
    description: 'Mobile operating system developed by Google. Powers billions of devices worldwide with rich APIs for building powerful mobile applications.',
    category: 'Platform',
    color: 'from-green-500 to-emerald-500'
  },

  // UI Frameworks
  'Jetpack Compose': {
    name: 'Jetpack Compose',
    description: 'Modern declarative UI toolkit for Android. Build native UI with less code using Kotlin, offering reactive programming and simplified state management.',
    category: 'UI Framework',
    color: 'from-blue-500 to-cyan-500'
  },
  'Material 3': {
    name: 'Material Design 3',
    description: 'Google\'s latest design system providing adaptive, personalized UI components. Features dynamic color theming and enhanced accessibility.',
    category: 'Design System',
    color: 'from-indigo-500 to-purple-500'
  },
  'Android Jetpack': {
    name: 'Android Jetpack',
    description: 'Suite of libraries to help developers build robust apps. Includes lifecycle management, navigation, data persistence, and dependency injection.',
    category: 'Library Suite',
    color: 'from-green-500 to-teal-500'
  },

  // Async & Concurrency
  'Coroutines': {
    name: 'Kotlin Coroutines',
    description: 'Lightweight concurrency framework for asynchronous programming. Simplifies background tasks with sequential code style and structured concurrency.',
    category: 'Concurrency',
    color: 'from-violet-500 to-purple-500'
  },
  'Coroutines + Flow': {
    name: 'Coroutines + Flow',
    description: 'Reactive streams in Kotlin for handling asynchronous data streams. Provides cold streams with backpressure support and powerful operators.',
    category: 'Reactive Programming',
    color: 'from-violet-500 to-fuchsia-500'
  },

  // Networking
  'GraphQL': {
    name: 'GraphQL',
    description: 'Query language for APIs allowing clients to request exactly the data needed. Reduces over-fetching and provides strong typing.',
    category: 'API Technology',
    color: 'from-pink-500 to-rose-500'
  },
  'REST APIs': {
    name: 'REST APIs',
    description: 'Architectural style for networked applications using HTTP methods. Industry standard for web services with stateless communication.',
    category: 'API Technology',
    color: 'from-blue-500 to-sky-500'
  },
  'REST': {
    name: 'REST',
    description: 'RESTful web services architecture for scalable network applications. Uses standard HTTP methods for CRUD operations.',
    category: 'API Architecture',
    color: 'from-blue-500 to-sky-500'
  },

  // Architecture
  'MVVM / MVI': {
    name: 'MVVM / MVI',
    description: 'Architectural patterns separating UI from business logic. MVVM uses two-way binding, MVI emphasizes unidirectional data flow and immutability.',
    category: 'Architecture',
    color: 'from-amber-500 to-orange-500'
  },
  'Modular Architecture': {
    name: 'Modular Architecture',
    description: 'Breaking apps into independent, reusable modules. Improves build times, enables feature teams, and enforces clear boundaries.',
    category: 'Architecture',
    color: 'from-emerald-500 to-green-500'
  },

  // Navigation & UI
  'Navigation (Compose)': {
    name: 'Navigation Compose',
    description: 'Type-safe navigation library for Jetpack Compose. Handles fragment transactions, back stack, and deep linking seamlessly.',
    category: 'Navigation',
    color: 'from-cyan-500 to-blue-500'
  },
  'Compose UI Testing': {
    name: 'Compose UI Testing',
    description: 'Testing framework for Compose UIs. Write concise, readable tests with semantics-based assertions and automatic synchronization.',
    category: 'Testing',
    color: 'from-green-500 to-emerald-500'
  },

  // Data & Storage
  'Room / DataStore': {
    name: 'Room & DataStore',
    description: 'Room provides SQLite abstraction with compile-time verification. DataStore replaces SharedPreferences with async, type-safe storage.',
    category: 'Data Persistence',
    color: 'from-orange-500 to-amber-500'
  },
  'Firebase': {
    name: 'Firebase',
    description: 'Google\'s mobile platform with backend services. Includes real-time database, authentication, analytics, and cloud messaging.',
    category: 'Backend Platform',
    color: 'from-yellow-500 to-orange-500'
  },
  'Firebase Crashlytics': {
    name: 'Firebase Crashlytics',
    description: 'Real-time crash reporting tool. Provides detailed crash analytics, helping developers identify and fix issues quickly.',
    category: 'Monitoring',
    color: 'from-red-500 to-orange-500'
  },

  // Networking Libraries
  'GraphQL / Retrofit': {
    name: 'GraphQL / Retrofit',
    description: 'Type-safe HTTP clients for Android. Retrofit simplifies REST calls, GraphQL clients handle flexible data queries efficiently.',
    category: 'Networking',
    color: 'from-blue-500 to-indigo-500'
  },

  // CI/CD & DevOps
  'GitHub Actions': {
    name: 'GitHub Actions',
    description: 'CI/CD platform for automating workflows. Build, test, and deploy code with YAML-based configuration and extensive marketplace.',
    category: 'CI/CD',
    color: 'from-gray-600 to-gray-800'
  },
  'Jenkins': {
    name: 'Jenkins',
    description: 'Open-source automation server for continuous integration. Supports building, testing, and deploying software with extensive plugins.',
    category: 'CI/CD',
    color: 'from-red-600 to-red-800'
  },
  'Gradle Optimization': {
    name: 'Gradle Optimization',
    description: 'Techniques to speed up Android builds. Includes parallel execution, build cache, and configuration on demand.',
    category: 'Build Tools',
    color: 'from-green-600 to-teal-600'
  },
  'Detekt / Ktlint / Spotless': {
    name: 'Code Quality Tools',
    description: 'Static analysis and formatting tools for Kotlin. Enforce code style, detect code smells, and maintain consistent formatting.',
    category: 'Code Quality',
    color: 'from-purple-600 to-indigo-600'
  },
  'Automated Testing Pipelines': {
    name: 'Automated Testing Pipelines',
    description: 'Continuous testing infrastructure running unit, integration, and UI tests. Catches bugs early and ensures code quality.',
    category: 'Testing',
    color: 'from-emerald-600 to-green-600'
  },
  'Play Store Deployment': {
    name: 'Play Store Deployment',
    description: 'Automated app publishing to Google Play. Handles versioning, release tracks, and staged rollouts programmatically.',
    category: 'Deployment',
    color: 'from-blue-600 to-sky-600'
  },

  // Specialized
  'BLE': {
    name: 'Bluetooth Low Energy',
    description: 'Wireless technology for short-range communication with minimal power consumption. Used in wearables, IoT devices, and health monitors.',
    category: 'Hardware Integration',
    color: 'from-blue-600 to-indigo-600'
  },
  'WearOS': {
    name: 'Wear OS',
    description: 'Android-based operating system for smartwatches. Provides health tracking, notifications, and complications APIs.',
    category: 'Platform',
    color: 'from-green-600 to-emerald-600'
  },
  'Performance Profiling': {
    name: 'Performance Profiling',
    description: 'Tools and techniques to analyze app performance. Identify CPU, memory, and network bottlenecks for optimization.',
    category: 'Optimization',
    color: 'from-red-500 to-pink-500'
  },

  // Collaboration & Tools
  'Agile': {
    name: 'Agile Methodology',
    description: 'Iterative software development approach with sprints, standups, and retrospectives. Emphasizes flexibility and customer collaboration.',
    category: 'Methodology',
    color: 'from-teal-500 to-cyan-500'
  },
  'Jira': {
    name: 'Jira',
    description: 'Project management and issue tracking tool. Used for sprint planning, bug tracking, and team collaboration in agile workflows.',
    category: 'Project Management',
    color: 'from-blue-600 to-blue-800'
  },
  'Postman / Insomnia': {
    name: 'API Testing Tools',
    description: 'HTTP clients for API development and testing. Design, test, and document REST and GraphQL APIs with intuitive interfaces.',
    category: 'Development Tools',
    color: 'from-orange-500 to-red-500'
  },
  'Figma Collaboration': {
    name: 'Figma',
    description: 'Collaborative design tool for UI/UX. Real-time collaboration, prototyping, and design handoff for developers.',
    category: 'Design Tools',
    color: 'from-purple-500 to-pink-500'
  },
  'ADB & Shell Tools': {
    name: 'ADB & Shell Tools',
    description: 'Android Debug Bridge for device communication. Execute shell commands, install apps, and debug devices from command line.',
    category: 'Development Tools',
    color: 'from-gray-700 to-slate-700'
  },
  'Android Studio Profilers': {
    name: 'Android Studio Profilers',
    description: 'Real-time profiling tools for CPU, memory, network, and energy usage. Essential for identifying performance bottlenecks.',
    category: 'Development Tools',
    color: 'from-green-600 to-emerald-600'
  },

  // Soft Skills
  'Remote Collaboration': {
    name: 'Remote Collaboration',
    description: 'Working effectively in distributed teams across time zones. Uses video calls, async communication, and documentation.',
    category: 'Soft Skills',
    color: 'from-indigo-500 to-blue-500'
  },
  'Cross-functional Communication': {
    name: 'Cross-functional Communication',
    description: 'Collaborating with design, product, QA, and backend teams. Translating technical concepts for non-technical stakeholders.',
    category: 'Soft Skills',
    color: 'from-cyan-500 to-teal-500'
  }
};

// Helper function to get tech info with fallback
export const getTechInfo = (techName) => {
  return techInfo[techName] || {
    name: techName,
    description: 'A technology used in modern software development.',
    category: 'Technology',
    color: 'from-slate-500 to-gray-500'
  };
};

