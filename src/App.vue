<template>
  <div>
    <div class="details-container">
      <div v-if="!generatingQRCode">
        <p>User Information:</p>
        <div class="grid-container">
          <div v-for="(item, index) in info" :key="index" class="info-item">
            <span class="label">{{ item.label }}</span>
            <span
              class="value typing"
              :class="{
                cursorVisible: item.cursorVisible,
                cursorBlinking: item.cursorBlinking,
              }"
            >
              {{ item.animatedValue }}
            </span>
            <br />
            <br />
          </div>
        </div>
      </div>
      <div v-if="generatingQRCode" class="qr-code-container wave">
        <div v-for="(row, rowIndex) in qrCodePattern" :key="rowIndex" class="qr-row">
          <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="{ 'qr-cell': true, filled: cell, wave: cell }"
          ></div>
        </div>
      </div>
      <div v-if="showMatrixEffect" class="matrix-style">
        {{ animatedMatrixSentence }}
      </div>
    </div>
    <br>
    <div class="glowing-line top-line"></div>
    <!-- Top glowing line -->
    <p>How to Tell if a QR Code is Safe</p>
    <div class="glowing-line top-line"></div>
    <!-- Top glowing line -->
    <br>
    <p>Quishing or QR Code phishing is when hackers trick users to exfiltrate their sensitive data.
      Upon scanning a malicious QR Code, users submit their private information or download malware onto their mobile devices.
    </p>
    <br>
    QR Code scams are often of three types:
    <li>Fradulent QR Code: Leads to a website that prompts users to enter their personal information like credit card numbers. </li>
    <li>Fake QR Codes: initiate the download of a malicious softare on your mobile device </li>
    <li> QR Code that takes you to Fake Offers: Like rewards and discounts that don't exist </li>
    <br>
    <br>
    <div class="glowing-line top-line"></div>
    <!-- Top glowing line -->
    <p>Preveting a Malicous Hack</p>
    <div class="glowing-line top-line"></div>
    <!-- Top glowing line -->
    <br>
    <li>Use a Safe QR code scanning app <br>Android (8 and above) or an iOS (11 and above) uses your camera app to scan the OR code rather than downloading a seperate app for scam as these third-party apps ask for permissions unrelated to scanning a QR Code. It is also a way to hide malware. There are apps that can help tell you if QR codes appear safe or not.</li>
  </div>

</template>

<script>
import { set } from "mongoose";
import "./style.css";
import imageUrl from './assets/img/QR1.jpg'

export default {
  data() {
    return {
      qrCodePattern: [],
      info: [
        {
          label: "IP Address:",
          value: "",
          animatedValue: "",
          cursorVisible: true,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "City:",
          value: "",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "Region:",
          value: "",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "ZIP Code:",
          value: "",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "Country:",
          value: "",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "School:",
          value: "Brigham Young University",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "Full Name:",
          value: "Target Victim",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "Phone Number:",
          value: "*************",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "Email:",
          value: "************@*****.***",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: false,
          blur: false,
        },
        {
          label: "Device Password:",
          value: "*****",
          animatedValue: "",
          cursorVisible: false,
          cursorBlinking: true,
          blur: false,
        },
      ],
      currentInfoIndex: 0,
      showAccessGranted: false,
      showUserInfo: true,
      generatingQRCode: false,
      matrixSentence: "Could you trust this QR code?",
      animatedMatrixSentence: "",
      imageUrl: imageUrl,
    };
  },

  methods: {
    animateValue() {
      if (this.currentInfoIndex < this.info.length) {
        const infoItem = this.info[this.currentInfoIndex];
        let i = 0;
        const speed = 20;
        infoItem.animatedValue = "█";

        const animate = () => {
          if (i < infoItem.value.length) {
            infoItem.animatedValue =
              infoItem.animatedValue.slice(0, i) + infoItem.value.charAt(i) + "█";
            i++;
            setTimeout(animate, speed);
          } else {
            // Remove the '█' cursor character when done typing
            infoItem.animatedValue = infoItem.animatedValue.slice(0, -1);
            // Set cursorBlinking to true only after finishing the last item
            if (this.currentInfoIndex === this.info.length - 1) {
              infoItem.cursorBlinking = true;
              setTimeout(() => {
                this.eraseData();
                infoItem.cursorBlinking = false;
              }, 20000);
            }

            // Typing for this item is done
            if (this.currentInfoIndex < this.info.length - 1) {
              // Non-last item
              this.currentInfoIndex++;
              this.info[this.currentInfoIndex].cursorVisible = true; // Activate cursor for the next item
              setTimeout(this.animateValue, 500);
            } else {
              // Last item
              setTimeout(() => {
                this.showAccessGranted = true; // Show "Access Granted" message
              }, 500);
            }
          }
        };
        if (this.currentInfoIndex < this.info.length) {
          this.info[this.currentInfoIndex].animatedValue = "█"; // Initialize with the cursor character
          animate();
        }
      }
    },
    generateQRCode() {
      const size = 21; // Size of the QR code (for a Version 1 QR code)

      // Initialize the QR code pattern with false values
      this.qrCodePattern = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => false)
      );

      // Helper method to place a pattern into the qrCodePattern at the specified coordinates
      const placePattern = (qrCodePattern, pattern, startX, startY) => {
        for (let row = 0; row < pattern.length; row++) {
          for (let col = 0; col < pattern.length; col++) {
            const targetRow = startX + row;
            const targetCol = startY + col;
            // Check bounds before assignment
            if (
              targetRow < qrCodePattern.length &&
              targetCol < qrCodePattern[targetRow].length
            ) {
              qrCodePattern[targetRow][targetCol] = pattern[row][col];
            } else {
              // Log an error or handle the out-of-bounds issue
              console.error(
                "Attempting to place pattern out of bounds:",
                targetRow,
                targetCol
              );
            }
          }
        }
      };

      // Function to generate a pattern with a hollow square and a filled square in the center
      const generatePatternWithSmallBox = (patternSize, innerBoxSize) => {
        const pattern = Array.from({ length: patternSize }, () =>
          Array.from({ length: patternSize }, () => false)
        );

        // Create the border
        for (let i = 0; i < patternSize; i++) {
          pattern[0][i] = true;
          pattern[patternSize - 1][i] = true;
          pattern[i][0] = true;
          pattern[i][patternSize - 1] = true;
        }

        // Create the filled center square
        const offset = (patternSize - innerBoxSize) / 2;
        for (let i = offset; i < offset + innerBoxSize; i++) {
          for (let j = offset; j < offset + innerBoxSize; j++) {
            pattern[i][j] = true;
          }
        }

        return pattern;
      };

      const isProtectedArea = (row, col) => {
        const protectedSize = 8;
        const alignmentPatternStart = size;
        return (
          (row < protectedSize && (col < protectedSize || col >= size - protectedSize)) ||
          (row >= size - protectedSize && col < protectedSize) ||
          (row >= alignmentPatternStart && col >= alignmentPatternStart)
        );
      };

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (!this.qrCodePattern[row][col] && !isProtectedArea(row, col)) {
            this.qrCodePattern[row][col] = Math.random() < 0.5;
          }
        }
      }

      // Generate the finder and alignment patterns
      const finderPattern = generatePatternWithSmallBox(7, 3); // Finder pattern size is 7x7 with a 3x3 filled square
      const alignmentPattern = generatePatternWithSmallBox(5, 1); // Alignment pattern size is 5x5 with a 1x1 filled square

      // Place the finder patterns in the corners
      placePattern(this.qrCodePattern, finderPattern, 0, 0);
      placePattern(this.qrCodePattern, finderPattern, size - 7, 0);
      placePattern(this.qrCodePattern, finderPattern, 0, size - 7);

      // Place the alignment pattern
      placePattern(this.qrCodePattern, alignmentPattern, size - 8, size - 8); // Positioning at bottom right

      // Function to generate a pattern with a hollow square and a filled square in the center
      // Helper functions to determine if the cell is part of the finder or alignment patterns
      // Iterate over the grid to set the finder and alignment patterns
    },

    generatePixels(imageSource, numPixelsWide, numPixelsTall, pixelSize) {
      const container = this.$el.querySelector('#image-container');
      const totalPixels = numPixelsWide * numPixelsTall;

      for (let i = 0; i < totalPixels; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.style.backgroundImage = `url('${imageSource}')`;
        const x = (i % numPixelsWide) * pixelSize;
        const y = Math.floor(i / numPixelsWide) * pixelSize;
        pixel.style.backgroundPosition = `-${x}px -${y}px`;
        pixel.style.opacity = 0;
        container.appendChild(pixel);
      }
      this.revealPixels(totalPixels);
    },

    revealPixels(totalPixels) {
      const pixels = this.$el.querySelectorAll('.pixel');
      let count = 0;
      const interval = setInterval(() => {
        if (count >= totalPixels) {
          clearInterval(interval);
          return;
        }
        pixels[count].style.opacity = 1;
        count++;
      }, 10); // Adjust time as needed
    },

    startQRCodeGeneration() {
      this.showUserInfo = false;
      this.generatingQRCode = true;
      setTimeout(() => {
        this.generateQRCode();
        this.applyWaveEffect(); // Apply wave effect after QR code generation
      }, 1000);
    },

    applyWaveEffect() {
      const waveDelay = 50;
      for (let row = 0; row < this.qrCodePattern.length; row++) {
        for (let col = 0; col < this.qrCodePattern[row].length; col++) {
          let delay = (row + col) * waveDelay;
          setTimeout(() => {
            if (this.qrCodePattern[row][col]) {
              this.qrCodePattern[row][col] = true; // Direct assignment works in Vue 3
            }
          }, delay);
        }
      }
    },

    eraseData() {
      let index = 0;
      const eraseSpeed = 100;
      const erase = () => {
        if (index < this.info.length) {
          this.info[index].animatedValue = "";
          index++;
          setTimeout(erase, eraseSpeed);
        }
      };
      erase();
    },

    fetchIPAddress() {
      fetch("/api/json/")
        .then((response) => response.json())
        .then((data) => {
          // Assign fetched data to info array values
          this.info[0].value = data.ip;
          this.info[1].value = data.city;
          this.info[2].value = data.region;
          this.info[3].value = data.postal;
          this.info[4].value = data.country;
          // ... set other values
          this.animateValue(); // Start animation after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching IP:", error);
        });
    },

    startMatrixAnimation() {
      const baseSentence = " you trust this QR code?"; // Added space before 'you'
      const words = ["Could", "Would", "Should"];
      let currentWordIndex = 0;
      let animatedSentence = ''. padStart(words[0].length, ' ');
      let index = 0; 

      const scramble = () => {
        let finalWord;
        if (currentWordIndex === -1) {
          finalWord = words[0] + baseSentence;
        } else {
          finalWord = words[currentWordIndex] + baseSentence; // Only the first word for subsequent animations
        }

        if (index < finalWord.length) {
          let randomChar; // Random char from ASCII range
          if(Math.random() < 0.9) {
            randomChar = finalWord.charAt(index);
          } else {
            randomChar = String.fromCharCode(65 + Math.random() * 26);
          }

          animatedSentence = animatedSentence.substr(0, index) + randomChar + animatedSentence.substr(index + 1);
          this.animatedMatrixSentence = animatedSentence;

          if(randomChar === finalWord.charAt(index)) {
            index++;
          }

          setTimeout(scramble, 50); // Adjust the speed of animation here
        } else {
            index = 0; 
            currentWordIndex = (currentWordIndex + 1) % words.length;
            animatedSentence = ''.padStart(words[currentWordIndex].length, ' ');
            setTimeout(scramble, 2000);
        }
      };
      scramble();
    }
  },

  mounted() {
    this.fetchIPAddress();
    setTimeout(this.startQRCodeGeneration, 10000);
    setTimeout(() => {
      this.showMatrixEffect = true;
      this.startMatrixAnimation();
    }, 11000);
  },
};
</script>

<style>
@keyframes blink {
  50% {
    visibility: hidden;
  }
}

@keyframes wave {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes waveEffect {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.access-granted {
  position: absolute;
  font-family: "DinaRemaster", monospace;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: #00d1d1; /* or any color you prefer */
  /* Additional styling as needed */
}

.blur {
  filter: blur(5px);
}

.blur-effect {
  filter: blur(5px);
}

.cyan-filtered-image {
  width: 80%;
  filter: sepia(1) saturate(1000%) hue-rotate(160deg);
  opacity: 0.5;
}

.details-container {
  font-family: "DinaRemaster", monospace;
  font-size: 1rem;
  height: 431px;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellepsis, rgb(0, 36, 36) 10%, rgba(0, 0, 0, 0.8) 0%);
  background: repeating-linear-gradient(to right, #000 0px, #001d1d 1px, #000 2px);
  animation: wave 2ms linear infinite;
  background-size: 200% 100%;
  text-align: left;
  padding: 20px;
  margin: 20px;
  text-shadow: 0 0 1px #00d1d1, 0 0 4px #00d1d1;
  box-shadow: inset 0 0 5px rgba(0, 107, 107, 0.1), inset 0 0 15px rgba(0, 97, 97, 0.1),
    inset 0 0 10px rgba(0, 36, 36, 0.9), inset 0 0 70px rgba(0, 36, 36, 0.9);
}

.glowing-line {
  position: absolute;
  left: 50%; /* Start at the center of the container */
  width: calc(50% + 100px); /* Adjust based on your content */
  height: 2px; /* Thickness of the line */
  background: rgba(0, 209, 209, 0.9); /* Line color */
  box-shadow: 0 0 10px rgba(0, 209, 209, 0.9); /* Glow effect */
  transform: translateX(-50%); /* Center align */
}

.glowing-text {
  color: #00d1d1;
  text-shadow: 0 0 1px #00e6e6, 0 0 4px #00e6e6;
}

.grid-container {
  display: grid;
  grid-template-columns: auto 1fr; /* Adjust the column sizes as needed */
  grid-column-gap: 20px 1fr;
  grid-row-gap: 5px; /* Adjust the row sizes as needed */
  width: 360px;
}

.info-item {
  display: contents;
}

.label {
  font-family: "DinaRemaster", monospace;
  grid-column: 1; /* Place the label in the first column */
  text-align: left;
  padding-right: 1em; /* Space between label and value */
}

.matrix-style {
  color: #00d1d1; /* Green text */
  font-family: "DinaRemaster", monospace;
  background-color: 000;
  padding: 10px;
  font-size: 18px;
  /* Additional styling as needed */
}

.qr-code-container {
  display: grid;
  grid-template-columns: repeat(21, 10px);
  border-radius: 100px;
  grid-gap: 0px;
  justify-content: center;
  margin-top: 20px;
  background-color: #00e5e500;
}

.qr-row {
  display: contents;
}

.qr-cell {
  width: 10px;
  height: 10px;
}

.qr-cell.filled {
  background-color: #00d1d1;
}

.qr-cell.wave {
  animation: waveEffect 10s forwards;
}

.typing {
  font-family: "DinaRemaster", monospace;
  white-space: pre;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 1px #002424, 0 0 4px #002424;
}

.typing::after {
  content: "";
  position: absolute;
  right: 0;
  color: rgba(0, 209, 209, 0.9); /* Color of your input field */
  opacity: 1; /* Fully visible when shown */
  text-shadow: none;
}

.typing.cursor::after {
  content: "█";
  position: absolute;
  right: 0;
  color: #001818;
  visibility: visible; /* Initially hide the cursor */
}

.typing.cursorBlinking::after {
  content: "█";
  position: relative;
  right: 0;
  color: #002424; /* Color of your input field */
  opacity: 1; /* Fully visible when shown */
  animation: blink 1s step-end infinite;
  visibility: hidden; /* Apply the blinking animation */
}

.typing.cursorVisible::after {
  visibility: visible; /* Show the cursor when typing */
}

.value {
  display: inline-block;
  font-family: "DinaRemaster", monospace;
  background-color: rgba(0, 209, 209, 0.8);
  text-shadow: 0 0 1px #002424, 0 0 1px #002424;
  box-shadow: 0 0 10px rgba(0, 209, 209, 0.4); /* Glow effect */
  border-radius: 2px;
  color: #002424;
  padding: 0.1rem 0.5rem;
  max-width: 210px;
  height: 20px;
  overflow: hidden;
  grid-column: 2; /* Place the value in the second column */
  text-align: left; /* Align the value text to the left */
  white-space: nowrap; /* Prevent the value from wrappig */
  text-overflow: ellipsis;
  position: relative; /* For the cursor positioning */
}
</style>
