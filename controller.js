// Version 1.0.2a
import { loadCurrencyData, getCurrencyRate, convertCurrency } from './model.js';
import { updateLabels, selectCurrencyByName, updateLastUpdateDate, fillCurrencyDropdowns } from './view.js';

let currencyData = {}; // Speichert die Währungsdaten

// Funktion zum Füllen der Dropdowns und Setzen der Standardwährungen
export async function initializeCurrencyConverter() {
    currencyData = await loadCurrencyData(); // Lade die Währungsdaten aus dem Model

    if (currencyData) {
        currencyData['usd'] = {
            code: 'USD',
            name: 'US-Dollar',
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

// Dynamische Rundungsfunktion für Beträge
function formatCurrencyDynamically(value) {
    if (value === 0) {
        // Bei Null wird auf zwei Dezimalstellen gerundet
        return value.toFixed(2);
    }

    const valueStr = value.toString();

    if (value < 1) {
        // Für Werte kleiner als 1 wird die Anzahl der Dezimalstellen dynamisch angepasst
        let decimalPlacesToKeep = 2; // Standardmäßig mindestens 2 Dezimalstellen
        let foundNonZero = false;

        // Durchlaufe die Zeichen des Werts nach dem Dezimalpunkt, um die Anzahl der Dezimalstellen zu bestimmen
        for (let i = 2; i < valueStr.length; i++) {
            const currentChar = valueStr.charAt(i);
            if (currentChar !== '0' && currentChar !== '.') {
                foundNonZero = true;
            }

            if (foundNonZero) {
                decimalPlacesToKeep = i;
                break;
            }
        }

        // Runden auf die dynamische Anzahl der Dezimalstellen
        return value.toFixed(decimalPlacesToKeep);
    }

    // Für Werte größer oder gleich 1 wird auf zwei Dezimalstellen gerundet
    return value.toFixed(2);
}

// Funktion zur Umrechnung vom ersten Input (amount-input) in den zweiten (converted-amount-input)
export function calculateConversion() {
    const amountInput = parseFloat(document.getElementById('amount-input').value);
    const currencyFrom = document.getElementById('currency-from').value.toLowerCase();
    const currencyTo = document.getElementById('currency-to').value.toLowerCase();

    const fromRate = getCurrencyRate(currencyFrom, currencyData);
    const toRate = getCurrencyRate(currencyTo, currencyData);

    if (fromRate && toRate) {
        let convertedAmount = (amountInput / fromRate) * toRate;

        // Verwende die dynamische Formatierungsfunktion für den konvertierten Betrag
        const formattedAmount = formatCurrencyDynamically(convertedAmount);

        // Setze das Ergebnis in das Eingabefeld
        document.getElementById('converted-amount-input').value = formattedAmount;

        updateLabels();
    }
}

// Funktion zur Umrechnung vom zweiten Input (converted-amount-input) in den ersten (amount-input)
export function calculateReverseConversion() {
    const convertedAmountInput = parseFloat(document.getElementById('converted-amount-input').value);
    const currencyFrom = document.getElementById('currency-from').value.toLowerCase();
    const currencyTo = document.getElementById('currency-to').value.toLowerCase();

    const fromRate = getCurrencyRate(currencyFrom, currencyData);
    const toRate = getCurrencyRate(currencyTo, currencyData);

    if (fromRate && toRate) {
        let originalAmount = (convertedAmountInput / toRate) * fromRate;

        // Verwende die dynamische Formatierungsfunktion für den Originalbetrag
        const formattedOriginalAmount = formatCurrencyDynamically(originalAmount);

        // Setze das Ergebnis in das Eingabefeld
        document.getElementById('amount-input').value = formattedOriginalAmount;
        updateLabels();
    }
}



// Funktion zur Validierung des Eingabefeldes
function validateNumberInput(inputField) {
    inputField.addEventListener('keydown', function(event) {
        // Erlaube Zahlen, Rücktaste, Tab, Escape, Enter, und Dezimalpunkt
        if (
            (event.key >= 0 && event.key <= 9) || // Zahlen 0-9
            event.key === '.' ||                  // Dezimalpunkt
            event.key === 'Backspace' ||          // Rücktaste
            event.key === 'Tab' ||                // Tab
            event.key === 'Escape' ||             // Escape
            event.key === 'Enter'                 // Enter
        ) {
            // Erlaubte Tasten, kein Eingreifen
            return;
        }

        // Verhindere alle anderen Eingaben wie e, +, -
        event.preventDefault();
    });
}


// Funktion zum Setzen der Standardwerte (z.B. "Euro" und "US Dollar")
function setDefaultValues() {
    document.getElementById('amount-input').value = 1; // Standardwert für Betrag

    // Setze die Standardwährungen
    selectCurrencyByName('currency-from', 'Euro');
    selectCurrencyByName('currency-to', 'US-Dollar');
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

    // Validierung für das 'amount-input'-Feld
    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
        validateNumberInput(amountInput);
    }

    // Validierung für das 'converted-amount-input'-Feld
    const convertedAmountInput = document.getElementById('converted-amount-input');
    if (convertedAmountInput) {
        validateNumberInput(convertedAmountInput);
    }
});
