export const TimeFormats = [
    "HH:mm",             // 24-hour format without seconds
    "hh:mm a",           // 12-hour format with AM/PM
    "HH:mm:ss",          // 24-hour format with seconds
    "hh:mm:ss a",        // 12-hour format with seconds and AM/PM
    "HH:mm:ss.SSS",      // 24-hour format with milliseconds
    "hh:mm:ss.SSS a",    // 12-hour format with milliseconds and AM/PM
    "HH:mm:ss Z",        // 24-hour format with timezone offset
    "hh:mm:ss a Z",      // 12-hour format with AM/PM and timezone offset
    "HH:mm:ss.SSS Z",    // 24-hour format with milliseconds and timezone offset
    "hh:mm:ss.SSS a Z",  // 12-hour format with milliseconds, AM/PM, and timezone offset
    "HH:mm:ss.SSSSSS",   // 24-hour format with microseconds
    "hh:mm:ss.SSSSSS a", // 12-hour format with microseconds and AM/PM
    "HH:mm:ss.SSSSSS Z", // 24-hour format with microseconds and timezone offset
    "hh:mm:ss.SSSSSS a Z", // 12-hour format with microseconds, AM/PM, and timezone offset
    "HH:mm:ss.SSSSSSSS", // 24-hour format with nanoseconds
    "hh:mm:ss.SSSSSSSS a", // 12-hour format with nanoseconds and AM/PM
    "HH:mm:ss.SSSSSSSS Z", // 24-hour format with nanoseconds and timezone offset
    "hh:mm:ss.SSSSSSSS a Z", // 12-hour format with nanoseconds, AM/PM, and timezone offset
];


export const dateFormats = [
    { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },        // 2024-08-16
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },        // 08/16/2024
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },        // 16/08/2024
    { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },        // 2024/08/16
    { label: "DD-MM-YYYY", value: "DD-MM-YYYY" },        // 16-08-2024
    { label: "MM-DD-YYYY", value: "MM-DD-YYYY" },        // 08-16-2024
    { label: "DD MMM YYYY", value: "DD MMM YYYY" },      // 16 Aug 2024
    { label: "MMM DD, YYYY", value: "MMM DD, YYYY" },    // Aug 16, 2024
    { label: "MMMM DD, YYYY", value: "MMMM DD, YYYY" },  // August 16, 2024
    { label: "DD MMMM YYYY", value: "DD MMMM YYYY" },    // 16 August 2024
    { label: "MM/DD/YY", value: "MM/DD/YY" },            // 08/16/24
    { label: "DD/MM/YY", value: "DD/MM/YY" },            // 16/08/24
    { label: "YYYY.MM.DD", value: "YYYY.MM.DD" },        // 2024.08.16
    { label: "MM.DD.YYYY", value: "MM.DD.YYYY" },        // 08.16.2024
    { label: "DD.MM.YYYY", value: "DD.MM.YYYY" },        // 16.08.2024
    { label: "YYYY年MM月DD日", value: "YYYY年MM月DD日" },  // 2024年08月16日 (Japanese format)
    { label: "YYYY-MM-DDTHH:mm:ssZ", value: "YYYY-MM-DDTHH:mm:ssZ" }, // 2024-08-16T14:30:00Z (ISO 8601)
];


export const TimeZones = [
    { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
    { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
    { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Kolkata', label: 'Kolkata' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
];

export const clothMeasurementUnits = [
    "millimeter (mm)",
    "centimeter (cm)",
    "meter (m)",
    "inch (in)",
    "foot (ft)",
    "yard (yd)"
];

export const currencies = [
    { label: "INR (Indian Rupee)", value: "INR ₹" },
    { label: "USD (United States Dollar)", value: "USD $" },
    { label: "EUR (Euro)", value: "EUR €" },
    { label: "GBP (British Pound Sterling)", value: "GBP £" },
    { label: "JPY (Japanese Yen)", value: "JPY ¥" },
    { label: "CNY (Chinese Yuan)", value: "CNY ¥" },
    { label: "AUD (Australian Dollar)", value: "AUD A$" },
    { label: "CAD (Canadian Dollar)", value: "CAD C$" },
    { label: "SGD (Singapore Dollar)", value: "SGD S$" },
    { label: "AED (United Arab Emirates Dirham)", value: "AED د.إ" }
];

