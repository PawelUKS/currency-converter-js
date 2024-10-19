// Funktion, um den Text in einem Dropdown (select) auszuwählen
export function selectCurrencyByName(selectElementId, currencyName) {
    const selectElement = document.getElementById(selectElementId);
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === currencyName) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}

// Funktion zum dynamischen Aktualisieren der Labels
export function updateLabels() {
    const amountInput = document.getElementById('amount-input').value;

    const currencyFromSelect = document.getElementById('currency-from');
    const currencyFrom = currencyFromSelect.options[currencyFromSelect.selectedIndex].text;

    const convertedAmount = document.getElementById('converted-amount-input').value;

    const currencyToSelect = document.getElementById('currency-to');
    const currencyTo = currencyToSelect.options[currencyToSelect.selectedIndex].text;

    // Update für das erste Label
    const conversionLabel = `${amountInput} ${currencyFrom} entspricht`;
    document.getElementById('conversion-label').textContent = conversionLabel;

    // Update für das zweite Label (größere Schrift für den Betrag)
    const resultLabel = `${convertedAmount} ${currencyTo}`;
    document.getElementById('result-label').textContent = resultLabel;
}

// Funktion zum Formatieren des Datums ins Format "TT.MM.JJJJ HH:MM:SS" mit Zeitzone "Europe/Berlin"
export function formatDate(dateString) {
    const date = new Date(dateString); // Verwende das Date-Objekt ohne UTC

    // Verwende Intl.DateTimeFormat für die Berlin-Zeitzone
    const formatter = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-Stunden-Format
    });

    // Formatiere das Datum entsprechend den Optionen
    const formattedParts = formatter.formatToParts(date);

    // Extrahiere die einzelnen Teile (Tag, Monat, Jahr, Stunde, Minute, Sekunde)
    const day = formattedParts.find(part => part.type === 'day').value;
    const month = formattedParts.find(part => part.type === 'month').value;
    const year = formattedParts.find(part => part.type === 'year').value;
    const hour = formattedParts.find(part => part.type === 'hour').value;
    const minute = formattedParts.find(part => part.type === 'minute').value;
    const second = formattedParts.find(part => part.type === 'second').value;

    // Setze das Datum zusammen: "TT.MM.JJJJ HH:MM:SS"
    return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
}

// Funktion zum Aktualisieren des Datums der letzten Aktualisierung
export function updateLastUpdateDate(date) {
    const formattedDate = formatDate(date); // Formatierung aufrufen
    document.getElementById('last-update').textContent = formattedDate;
}

// Event-Listener für dynamische Updates
document.getElementById('amount-input').addEventListener('input', updateLabels);
document.getElementById('currency-from').addEventListener('change', updateLabels);
document.getElementById('converted-amount-input').addEventListener('input', updateLabels);
document.getElementById('currency-to').addEventListener('change', updateLabels);
