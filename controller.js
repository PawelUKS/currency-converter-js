import { loadCurrencyData, getCurrencyRate, convertCurrency } from './model.js';
import { updateLabels, selectCurrencyByName, updateLastUpdateDate } from './view.js';

let currencyData = {}; // Speichert die Währungsdaten

// Funktion zum Füllen der Dropdowns und Setzen der Standardwährungen
export async function initializeCurrencyConverter() {
    currencyData = await loadCurrencyData(); // Lade die Währungsdaten aus dem Model; // Hole die Währungsdaten aus dem Model

    if (currencyData) {
        currencyData['usd'] = {
            code: 'USD',
            name: 'US Dollar',
            rate: 1.0
        };

        // Extrahiere das erste "date" aus den Währungsdaten
        const firstDate = Object.values(currencyData)[0]?.date || 'Datum unbekannt';

        // Aktualisiere das "updated-at"-Label mit dem gefundenen Datum
        updateLastUpdateDate(firstDate);

        // Währungsnamen trimmen (Leerzeichen entfernen) und alphabetisch sortieren
        const sortedData = Object.values(currencyData)
            .map(currency => {
                return {
                    ...currency,
                    name: currency.name.trim() // Währungsnamen trimmen
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetische Sortierung

         fillCurrencyDropdowns(sortedData); // Fülle die Dropdowns mit den sortierten Daten
         setDefaultValues(); // Setze die Standardwährungen (Euro, US Dollar)
         updateLabels(); // Aktualisiere die Labels

        // Führe die Berechnung bei Programmstart durch
        calculateConversion();
    }
}
// Funktion zur Umrechnung vom ersten Input (amount-input) in den zweiten (converted-amount-input)
export function calculateConversion() {
    const amountInput = parseFloat(document.getElementById('amount-input').value);
    const currencyFrom = document.getElementById('currency-from').value.toLowerCase();
    const currencyTo = document.getElementById('currency-to').value.toLowerCase();

    // Debugging: Wechselkurse ausgeben
    console.log(`Betrag: ${amountInput}, Währung von: ${currencyFrom}, Währung nach: ${currencyTo}`);

    const fromRate = getCurrencyRate(currencyFrom, currencyData);
    const toRate = getCurrencyRate(currencyTo, currencyData);

    // Debugging: Raten ausgeben
    console.log(`Rate von ${currencyFrom}: ${fromRate}, Rate von ${currencyTo}: ${toRate}`);

    if (fromRate && toRate) {
        const convertedAmount = convertCurrency(amountInput, fromRate, toRate);
        console.log(`Konvertierter Betrag: ${convertedAmount}`);
        document.getElementById('converted-amount-input').value = convertedAmount.toFixed(2);
        updateLabels();
    }
}

// Funktion zur Umrechnung vom zweiten Input (converted-amount-input) in den ersten (amount-input)
export function calculateReverseConversion() {
    const convertedAmountInput = parseFloat(document.getElementById('converted-amount-input').value);
    const currencyFrom = document.getElementById('currency-from').value.toLowerCase();
    const currencyTo = document.getElementById('currency-to').value.toLowerCase();

    // Debugging: Wechselkurse ausgeben
    console.log(`Umgekehrte Berechnung: Betrag: ${convertedAmountInput}, Währung von: ${currencyTo} nach ${currencyFrom}`);

    const fromRate = getCurrencyRate(currencyFrom, currencyData);
    const toRate = getCurrencyRate(currencyTo, currencyData);

    // Debugging: Raten ausgeben
    console.log(`Rate von ${currencyFrom}: ${fromRate}, Rate von ${currencyTo}: ${toRate}`);

    if (fromRate && toRate) {
        const originalAmount = convertCurrency(convertedAmountInput, toRate, fromRate);
        console.log(`Umgekehrter konvertierter Betrag: ${originalAmount}`);
        document.getElementById('amount-input').value = originalAmount.toFixed(2);
        updateLabels();
    }
}

// Funktion zum Füllen der Dropdowns mit den Währungsdaten
function fillCurrencyDropdowns(data) {
    const currencyFromSelect = document.getElementById('currency-from');
    const currencyToSelect = document.getElementById('currency-to');

    // Füge die Optionen für beide Dropdowns hinzu
    Object.values(data).forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency.code;
        optionFrom.text = currency.name;

        const optionTo = document.createElement('option');
        optionTo.value = currency.code;
        optionTo.text = currency.name;

        currencyFromSelect.appendChild(optionFrom);
        currencyToSelect.appendChild(optionTo);
    });
}

// Funktion zum Setzen der Standardwerte (z.B. "Euro" und "US Dollar")
function setDefaultValues() {
    document.getElementById('amount-input').value = 1; // Standardwert für Betrag

    // Setze die Standardwährungen
    selectCurrencyByName('currency-from', 'Euro');
    selectCurrencyByName('currency-to', 'US Dollar');
}

// Event-Listener für Eingaben und Währungsänderungen
document.addEventListener('DOMContentLoaded', () => {
    // Initialisiere den Währungsrechner beim Laden der Seite
    initializeCurrencyConverter();

    // Event-Listener für Eingaben und Währungsänderungen im ersten Input (Betrag)
    document.getElementById('amount-input').addEventListener('input', calculateConversion);
    document.getElementById('currency-from').addEventListener('change', calculateConversion);
    document.getElementById('currency-to').addEventListener('change', calculateConversion);

    // Event-Listener für Eingaben im zweiten Input (konvertierter Betrag)
    document.getElementById('converted-amount-input').addEventListener('input', calculateReverseConversion);
});
