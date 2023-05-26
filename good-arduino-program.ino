#include "Wire.h"
#include "LiquidCrystal_I2C.h"
#define TOF10120_ADDRESS 0x52

LiquidCrystal_I2C LCD(0x27, 16, 2); // Définit le type d'écran lcd 16x2

// Sensors' PINS
const int IR1_PIN = A15;
const int IR2_PIN = A14;
const int BoutonRes = 2;

// Sensors' values
int ir1Value = 0;
int ir2Value = 0;
float laserValue = 0;

// Sensors' states
bool ir1Active = false;
bool ir2Active = true;
bool laserMeasuring = false;

bool sendData = false;

// Distance measure
float maxDistance = 0;
float currentDistance = 0;
unsigned long previousTime = 0;
const unsigned long delayTime = 400;
unsigned long measurementTime = 0;

bool switchOff = true;

unsigned long pressedBtn = 0;

// LCD variables
String line1 = "Not detected";
String oldLine1 = "";
String line2 = "";
String oldLine2 = "";

void setup()
{
  Wire.begin();
  Serial.begin(9600);
  LCD.init();
  LCD.backlight();

  // PINS initiation
  pinMode(IR1_PIN, INPUT);
  pinMode(IR2_PIN, INPUT);
  pinMode(BoutonRes, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(BoutonRes), reset, FALLING);
}

// Return distance sense by the TOF10120 in cms
float checkDistance()
{
  Wire.beginTransmission(TOF10120_ADDRESS);
  Wire.write(0x00);
  Wire.endTransmission(false);
  Wire.requestFrom(TOF10120_ADDRESS, 2, true);
  uint16_t distance = Wire.read() << 8 | Wire.read();

  return distance * 0.1;
}

// Attach interrupt to reset the LCD screen
void reset()
{
  if (millis() - pressedBtn >= 1000)
  {
    switchOff = !switchOff;
    line1 = "";
    line2 = "";
    pressedBtn = millis();
  }
}

// Main program
void loop()
{
  // Read of sensors' values
  ir1Value = digitalRead(IR1_PIN);
  ir2Value = !digitalRead(IR2_PIN);
  laserValue = checkDistance();

  // ON/OFF LCD screen
  if (switchOff)
  {
    LCD.noBacklight();
  }
  else
  {
    LCD.backlight();
  }

  // IR sensors check
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

  // Block under the laser sensor
  if (ir1Active && ir2Active)
  {
    if (!laserMeasuring)
    {
      // Start laser measurement
      laserMeasuring = true;

      maxDistance = 0;
    }
    currentDistance = laserValue;
    maxDistance = max(maxDistance, currentDistance);
    sendData = true;

    // Sending data to the Raspberry
    if (sendData)
    {
      // LCD text
      line1 = "Detected";
      line2 = "Depth : ";
      if (millis() - previousTime >= 100)
      {
        LCD.setCursor(8, 1);
        LCD.print(maxDistance - 5);
        previousTime = millis();
      }
      // Data => Raspberry
      sendMessage(maxDistance);
      maxDistance = 0;
      measurementTime = millis();
      sendData = false;
    }
  }
  else
  {
    // RESET msg for Raspberry
    Serial.println("RESET");
    // LCD text
    if (millis() - measurementTime >= 3000)
    {
      line1 = "Not detected";
      line2 = "";
    }
  }
  // Write defined LCD text
  writeLCD();
}

// Send measure to the Raspberry
void sendMessage(float distance)
{
  Serial.print("Measure : \"");
  Serial.print(distance);
  Serial.println("\"");
}

// Write defined LCD text
void writeLCD()
{

  // Clear LCD text
  String blankLine = "                ";

  // Check for changes on LCD line top
  if (oldLine1 != line1)
  {
    // Clear LCD text
    LCD.setCursor(0, 0);
    LCD.print(blankLine);
    // Write new text
    LCD.setCursor(0, 0);
    LCD.print(line1);
    // Change checking variable
    oldLine1 = line1;
  }

  // Check for changes on LCD line bottom
  if (oldLine2 != line2)
  {
    // Clear LCD text
    LCD.setCursor(0, 1);
    LCD.print(blankLine);
    // Write new text
    LCD.setCursor(0, 1);
    LCD.print(line2);
    // Change checking variable
    oldLine2 = line2;
  }
}