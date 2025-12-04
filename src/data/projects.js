export const projects = [
    {
        name: 'Corona-Warn-App',
        description:
            'Germany’s official COVID-19 digital contact tracing app. Built as a native Android app using the exposure notification API from Apple and Google, designed to protect users’ privacy while enabling anonymous notifications of possible exposure events. Developed by SAP and Deutsche Telekom for public health authorities.',
        tech: ['Kotlin', 'Android', 'Exposure Notification API', 'Bluetooth', 'Open Source'],
        image: 'images/Corona_Warn_App_Logo.jpg',
        articles: [
            {
                title: 'Programmed in less than 50 Days: Deutsche Telekom and SAP publish Corona Warn app',
                url: 'https://www.telekom.com/en/media/media-information/archive/deutsche-telekom-sap-corona-warn-app-programmed-in-50-days-602368'
            },
            {
                title: 'Germany’s COVID-19 App Helps Break the Infection Chain',
                url: 'https://news.sap.com/2021/02/germanys-covid-19-app-break-infection-chain/'
            },
        ],
        github: 'https://github.com/corona-warn-app/cwa-app-android',
        info: 'https://en.wikipedia.org/wiki/Corona-Warn-App',
    },
    {
        name: 'SAP Digital Aged Care',
        description:
            'A solution enabling senior care providers to predict risk, mobilize carers, share visibility with families, and foster independence for the elderly. Integrates IoT sensors and wearable data for analytics-driven insights and automated workflows, helping people live longer and healthier at home. Recognized as a Hasso Plattner Founders’ Award finalist.',
        tech: ['SAP', 'IoT', 'Wearables', 'Analytics', 'Qualtrics'],
        image: 'images/SAP_logo.webp',
        github: null,
        info: 'https://news.sap.com/2020/01/elder-care-hasso-plattner-founders-award-finalist/',
    },
    {
        name: 'Merchant Console by Mastercard',
        description:
            'Mastercard’s Merchant Console simplifies accepting payments and managing merchant API connections. Key SDK integrations enable mobile point-of-sale, reporting, and international transactions in a secure, developer-friendly fashion.',
        tech: ['Android', 'Java', 'Mastercard API', 'Payments'],
        image: 'images/MPG_social.avif',
        github: null,
        info: 'https://na-gateway.mastercard.com/api/documentation/integrationGuidelines/mobileSDK/gatewayAndroidSDK.html?locale=en_US',
    },
    {
        name: 'Toast POS Internationalization',
        description:
            'Internationalization of Toast’s Android-based Point-of-Sale (POS) platform. Project responsibilities include localization into key world languages, implementation of in-app language switching, and incremental rollout via feature flags—critical for broadening Toast’s reach beyond the US restaurant market.',
        tech: ['Android', 'Kotlin', 'Localization', 'Feature Flags', 'Toast POS'],
        image: 'images/toast.png',
        github: null,
        info: 'https://technology.toasttab.com/entry/internationalization-toast/',
    },
];
