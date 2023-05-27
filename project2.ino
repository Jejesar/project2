#include "Wire.h"
#include "LiquidCrystal_I2C.h"

#define TOF10120_ADDRESS 0x52
LiquidCrystal_I2C LCD(0x27, 16, 2); // Définit le type d'écran lcd 16x2

const int IR1_PIN = A15;
const int IR2_PIN = 6;
const int BoutonRes = 2;

// Variables pour stocker les valeurs des capteurs
int ir1Value = 0;
int ir2Value = 0;
float laserValue = 0;

// Variables pour le suivi de l'état des capteurs
bool ir1Active = false;
bool ir2Active = true;
bool laserMeasuring = false;
bool sendData = false;

// Variables pour la mesure de distance
float maxDistance = 0;
float currentDistance = 0;
unsigned long previousTime = 0;
const unsigned long delayTime = 2000;

void setup()
{
    Wire.begin();
    Serial.begin(9600);
    LCD.init();
    LCD.backlight();
    // Initialisation des broches des capteurs
    pinMode(IR1_PIN, INPUT);
    pinMode(IR2_PIN, INPUT);
    pinMode(BoutonRes, INPUT);
}

float checkDistance()
{
    Wire.beginTransmission(TOF10120_ADDRESS);
    Wire.write(0x00);
    Wire.endTransmission(false);
    Wire.requestFrom(TOF10120_ADDRESS, 2, true);
    uint16_t distance = Wire.read() << 8 | Wire.read();

    return distance * 0.1;
}

void loop()
{
    // Lecture des valeurs des capteurs
    ir1Value = digitalRead(IR1_PIN);
    ir2Value = digitalRead(IR2_PIN);
    laserValue = checkDistance();

    // Vérification des capteurs IR
    if (ir1Value == LOW && ir2Value == LOW)
    {
        ir1Active = true;
        ir2Active = true;
    }
    else
    {
        ir1Active = false;
        ir2Active = false;
    }

    // Vérification du capteur laser
    if (ir1Active && ir2Active)
    {
        if (!laserMeasuring)
        {
            // Démarrer la mesure laser
            laserMeasuring = true;
            maxDistance = 0;
            previousTime = millis();
        }
        currentDistance = laserValue;
        maxDistance = max(maxDistance, currentDistance);

        if (millis() - previousTime >= delayTime)
        {
            previousTime = millis();
            ir1Active = false;
            ir2Active = false;
        }
        sendData = true;
    }

    if (!ir1Active && !ir2Active)
    {
        Serial.println("RESET");
    }

    // Envoi des données
    if (sendData)
    {
        LCD.setCursor(0, 0);
        LCD.print("Detected");
        LCD.setCursor(1, 0);
        LCD.print("depth : ");
        LCD.print(maxDistance);
        sendMessage(maxDistance);
        maxDistance = 0;
        sendData = false;
    }
    else
    {
        LCD.clear();
        LCD.print("Not detected");
    }
}

void sendMessage(float distance)
{
    Serial.print("Measure : \"");
    Serial.print(distance);
    Serial.println("\"");
}