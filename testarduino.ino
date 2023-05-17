#define IR1 A15 // initialisation de la variable "OBSTACLE"
#define IR2 A13
#define BOUTONRES 2 // Buton Reset

int distanceMax = 0;
// unsigned long timer;
unsigned long elaspedTime; // Chrono lorsque la mesure est entre 4.5 et 5.5

void loop()
{

    bool proximite1 = digitalRead(IR1);
    bool proximite2 = digitalRead(IR2);

    float distance = checkDistance(); // mesurer la distance

    if (proximite1 == 1 && proximite2 == 1)
    {
        distanceMax = max(distanceMax, distance);
        elaspedTime = millis();
        // if ((millis() - timer >= 500) && (distanceMax > 4.5 && distanceMax < 5.5))
        while (distanceMax < 5.5 && distanceMax > 4.5)
        {
            if (millis() - elaspedTime >= 500)
            {
                distanceMax = 0;
                elaspedTime = millis();
                sendMesure(distanceMax);
            }
            // timer = millis();
        }
        if (distanceMax > 5.5 && distanceMax < 4.5)
        {
            if (millis() - elaspedTime >= 500)
            {
                distanceMax = 0;
                elaspedTime = millis();
                sendMesure(distanceMax);
            }
        }
    }
    else if (proximite1 == 0 && proximite2 == 1)
    {
        Serial.println(distanceMax);
    }
    else if (proximite1 == 1 && proximite2 == 0)
    {
        distanceMax = 0;
        // timer = millis();
    }
}

void sendMesure(float msgValue)
{

    String msgStart = "Mesure : \"";
    String msgEnd = "\"\r\n";

    if (msgValue > 9.5)
    {
        Serial.print(msgStart + 0 + msgEnd);
    }
    else if (msgValue > 8.5)
    {
        Serial.print(msgStart + 1 + msgEnd);
    }
    else if (msgValue > 7.5)
    {
        Serial.print(msgStart + 2 + msgEnd);
    }
    else if (msgValue > 6.5)
    {
        Serial.print(msgStart + 3 + msgEnd);
    }
    else if (msgValue > 5.5)
    {
        Serial.print(msgStart + 4 + msgEnd);
    }
    else if (msgValue > 4.5)
    {
        Serial.print(msgStart + 5 + msgEnd);
    }
    else if (msgValue == 0)
    {
        Serial.print("RESET\r\n");
    }
}