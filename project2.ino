// #define IR1 2 // initialisation de la variable "OBSTACLE"
// #define IR2 3
// #define BOUTONRES 4 // Buton Reset
// #define LASER A0

// int distanceMax = 0;
// // unsigned long timer;
// unsigned long elaspedTime; // Chrono lorsque la mesure est entre 4.5 et 5.5

// void setup()
// {
//     Serial.begin(9600);

//     pinMode(IR1, INPUT);
//     pinMode(IR2, INPUT);

//     pinMode(LASER, INPUT);
// }

// float checkDistance()
// {
//     float distance = analogRead(LASER);
//     return distance * 0.01;
// }

// void loop()
// {

//     bool proximite1 = digitalRead(IR1);
//     bool proximite2 = digitalRead(IR2);

//     float distance = checkDistance(); // mesurer la distance

//     if (proximite1 && proximite2)
//     {
//         }

//     // Serial.println(distance);

//     // if (proximite1 == 1 && proximite2 == 1)
//     // {
//     //     distanceMax = max(distanceMax, distance);
//     //     elaspedTime = millis();
//     //     // if ((millis() - timer >= 500) && (distanceMax > 4.5 && distanceMax < 5.5))
//     //     while (distanceMax < 5.5 && distanceMax > 4.5)
//     //     {
//     //         if (millis() - elaspedTime >= 500)
//     //         {
//     //             sendMesure(distanceMax);
//     //             elaspedTime = millis();
//     //             distanceMax = 0;
//     //         }
//     //         // timer = millis();
//     //     }
//     //     if (distanceMax > 5.5 && distanceMax < 4.5)
//     //     {
//     //         if (millis() - elaspedTime >= 500)
//     //         {
//     //             sendMesure(distanceMax);
//     //             elaspedTime = millis();
//     //             distanceMax = 0;
//     //         }
//     //     }
//     // }
//     // else if (proximite1 == 0 && proximite2 == 1)
//     // {
//     //     // Serial.println(distanceMax);
//     // }
//     // else if (proximite1 == 1 && proximite2 == 0)
//     // {
//     //     distanceMax = 0;
//     //     // timer = millis();
//     // }
// }

// void sendMesure(float msgValue)
// {

//     String msgStart = "Mesure : \"";
//     String msgEnd = "\"\r\n";

//     if (msgValue > 9.5)
//     {
//         Serial.print(msgStart + 0 + msgEnd);
//     }
//     else if (msgValue > 8.5)
//     {
//         Serial.print(msgStart + 1 + msgEnd);
//     }
//     else if (msgValue > 7.5)
//     {
//         Serial.print(msgStart + 2 + msgEnd);
//     }
//     else if (msgValue > 6.5)
//     {
//         Serial.print(msgStart + 3 + msgEnd);
//     }
//     else if (msgValue > 5.5)
//     {
//         Serial.print(msgStart + 4 + msgEnd);
//     }
//     else if (msgValue > 4.5)
//     {
//         Serial.print(msgStart + 5 + msgEnd);
//     }
//     else if (msgValue == 0)
//     {
//         Serial.print("RESET\r\n");
//     }
// }
// Constantes pour les broches des capteurs
const int IR1_PIN = 2;
const int IR2_PIN = 3;
const int LASER_PIN = A0;

// Variables pour stocker les valeurs des capteurs
int ir1Value = 0;
int ir2Value = 0;
float laserValue = 0;

// Variables pour le suivi de l'état des capteurs
bool ir1Active = false;
bool ir2Active = false;
bool laserMeasuring = false;
bool sendData = false;

// Variables pour la mesure de distance
float maxDistance = 0;
float currentDistance = 0;
unsigned long previousTime = 0;
const unsigned long delayTime = 500;

void setup()
{
    Serial.begin(9600);

    // Initialisation des broches des capteurs
    pinMode(IR1_PIN, INPUT);
    pinMode(IR2_PIN, INPUT);
    pinMode(LASER_PIN, INPUT);
}

void loop()
{
    // Lecture des valeurs des capteurs
    ir1Value = digitalRead(IR1_PIN);
    ir2Value = digitalRead(IR2_PIN);
    laserValue = analogRead(LASER_PIN) * 0.01;

    // Vérification des capteurs IR
    if (ir1Value == HIGH && ir2Value == HIGH)
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
            sendData = true;
            sendMessage(maxDistance);
            maxDistance = 0;
            previousTime = millis();
        }
    }

    // Envoi des données
    if (sendData)
    {
        sendData = false;
        Serial.println("RESET");
    }
}

void sendMessage(float distance)
{
    Serial.print("Mesure : \"");

    if (distance >= 9.5f)
    {
        Serial.print(5);
    }
    else if (distance >= 8.5)
    {
        Serial.print(4);
    }
    else if (distance >= 7.5)
    {
        Serial.print(3);
    }
    else if (distance >= 6.5)
    {
        Serial.print(2);
    }
    else if (distance >= 5.5)
    {
        Serial.print(1);
    }
    else if (distance)
    {
        Serial.print(0);
    }

    Serial.println("\"");
}
