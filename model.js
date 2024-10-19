// Funktion zum Laden der Währungsdaten von der API
export async function loadCurrencyData() {
    const API_URL = 'https://www.floatrates.com/daily/usd.json';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${response.status}`);
        }
        const data = await response.json();
        return data; // Gibt die Währungsdaten zurück
    } catch (error) {
        console.error('Fehler beim Laden der Währungsdaten:', error);
        return null; // Fehlerfall: Gibt null zurück
    }
}

// Funktion zum Umrechnen von einer Währung in eine andere
export function convertCurrency(amount, fromRate, toRate) {
    // Berechnung des konvertierten Betrags
    return (amount / fromRate) * toRate;
}

// Funktion zum Laden des Wechselkurses für eine bestimmte Währung
export function getCurrencyRate(currencyCode, data) {
    const currency = data[currencyCode.toLowerCase()];
    return currency ? currency.rate : null;
}
