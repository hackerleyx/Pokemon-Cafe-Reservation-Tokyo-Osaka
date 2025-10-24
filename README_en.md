#Pokémon Cafe Reservation Assistant

- I'm not good at English, so the following content is most  from Google Translate. If something is wrong or ambiguities, please let me know.😊

##Description/项目简介
A Chrome extension that automatically submits and refreshes Pokémon Cafe reservations based on pre-set information. Available at Pokémon Cafes in Tokyo and Osaka.

###Functionality
1. Auto-Refresh: If the website displays "アクセスが集中し、サイトが混み合っております。The site is congested due to heavy access." the program will automatically and safely refresh the site.
    - Automatically clicks/performs required buttons/actions on the reservation website.
    - "Let's confirm you are human" - except for the image selection page, confirmation page for filling in reservation information, and subsequent operations. Because: The confirmation page can only be completed manually.

2. Quickly and automatically selects relevant information based on the number of people and date you specify.

3. Prioritizes the earliest available time in the order of seats A, B, C, and D.

    - The program's logic is as follows: on the date you select, it prioritizes seat A for availability. If seat A is unavailable, it looks for seat B, and so on. Once available, it selects the earliest available seat in chronological order.

    - So: If you need to specify a seat/time, this program may not be suitable for you at this time (but this feature may be updated in the future).

4. Automatically fill in your pre-set information.

    - This feature is designed to prevent submission failures due to unawareness of the booking website's validation criteria, inability to understand Japanese, or a lack of time to read the information. Although you've already locked in your selected seat upon entering this page (you have 20 minutes to submit the following information), it's possible that the website is busy and constantly refreshing. If your reservation is unsuccessful after 20 minutes, your locked seat will be released.

    - This feature does not upload your personal information to any other locations outside of the booking website. Your personal information is stored locally, and the extension does not have any data upload capabilities. You can start from any step in your reservation process.

5. You can manually navigate to any step on the reservation website and click "Start." The program will automatically recognize the steps you've already completed and immediately execute the next necessary step.

- The extension's current functionality can only help you so much; the rest depends on your internet speed and luck. I wish you all a smooth reservation.

##Installation

###Methon I
1. Download the ".crx" file from releases.
2. Open Chrome and manage your extensions, or simply enter chrome://extensions in the address bar.
3. Enable "Developer Mode" in the top-right corner.
4. Drop the file into Chrome.
5. When "Reserve Pokemon Cafe - Tokyo & Osaka" appears in the extension, installation is complete.

###Methon II
1. Download and unzip the project.

2. Open Chrome and manage your extensions, or simply enter chrome://extensions in the address bar.

3. Enable "Developer Mode" in the top-right corner.

4. Select "Load Unpackaged Extension."

5. Select the project directory.

6. When "Reserve Pokemon Cafe - Tokyo & Osaka" appears in the extension, installation is complete.

   > [!WARNING]
   > After installing the extension, the folder where the extension is stored cannot be moved, renamed or deleted




## Usage/使用

1. Click the extension icon, enter the number of people, desired reservation date, name, phone number, and email address, and click Save.
2. Visit website [Pokémon Cafe in Nihonbashi, Tokyo](https://reserve.pokemon-cafe.jp/)or  [Pokémon Cafe in Shinsaibashi, Osaka](https://osaka.pokemon-cafe.jp/), and a prompt will appear in the lower right corner to start normal operation.
   ###Details:
- If you haven't used the extension to save your reservation information, when you visit either of these websites, you'll see a prompt saying, "Please click on the plug-in to set the basic information"

- The default "Desired Reservation Date" is the latest available day (new reservations open at 6:00 PM JST).

- If the current step is displayed in the lower right corner and there's a "Start" button, click "Start" to run the program.

- All buttons will be automatically clicked, except for the following:

    - "Let's confirm you are human". On the image selection page, you'll need to follow the prompts to manually select the correct images (usually five images), then manually click "Confirm."
    - On the reservation information page, your pre-set information will automatically populate in the corresponding fields. However, you'll need to manually click "Submit" and proceed with the subsequent steps, including checking your email, entering your "Verification Code" (a 6-digit code consisting of uppercase and lowercase characters and numbers) on the next page, and confirming your reservation.


###Important Note
Because Pokémon Cafe reservations are extremely popular and typically sell out within a minute, you can/should:

- Visit the website for the first time around 5:55 PM Japan time (4:55 PM Beijing time, all times below are based on Japan time, minus one hour in China). Visit the website around 5:55 PM Japan time (4:55 PM Beijing time, all times below are based on Japan time, minus one hour in China) and complete the "We need to verify you're human" section. Each verification process takes about 5-10 minutes, so avoid verifying too early to avoid being redirected to this verification process at 6:00 PM and missing out on the opportunity.
- You can pause after selecting the number of people and wait until 5:59 PM before clicking "Start."

    - To explain:
      -The program automatically determines your current step and automatically starts the next one, so you don't have to worry about it restarting from the beginning.

      -The program is configured to automatically pause all operations if the time is between 5:59 PM and 6:00 PM, and then automatically restart at 6:00 PM. This prevents you from getting "dates not available yet" or "slow down" by clicking too quickly or too slowly.

      -Currently, when testing, the page doesn't display anything when the program is paused. Don't panic; the program is running. Do not open the extension or refresh the page. I will fix this issue as soon as possible.

-Notes on setting up reservation information:
1. The minimum number of people is 1, and the maximum is 6.
2. For your name, Separate your firstname and lastname with spaces, such as "Jone Doe"
3. For your phone number, you can enter your domestic phone number, but please pay attention to the format. If your phone number is 3012345678, you can enter it as 3012345678, 13012345678, or 0013012345678. All of these will pass the website verification. If you enter it as +13012345678, the program will automatically convert it to 0013012345678 and enter it on the website.
4. For your Email Address,  use your real email address. You need revieve Authentication code.

###Other booking tips(from Reddit).

- 20 and 40 minute mark chances:

    - is real! if you missed the 6:00 pm chance, wait again in 20 or 40 minutes. Sometimes even at 7pm, depends how many are still available at every round. Here you can ready the page up to the time selection, and just refresh at 06:20:00 or 06:40:00 mark. Again, session time counts, so just prepare the page at most 10 minutes ahead.
    - NOTE: Keep trying every 20mins until 7pm or 7:20pm JST
- more tips and CANCELLATION chances. Cancelled reservation usually appear one-two days before. Good thread read
    - TIP: Check one to two days before your target day starting at 9:40pm JST. From here on, the twenty minute rule would still apply. Check back again on precisely 10pm jst, 10:20 jst and every twenty minutes onwards. These cancellations popping up are highly likely from those resellers' unsold slots. This way is also the least stressfull option to get a reservation.

    - Be advised! on peak season and weekends, chances of finding cancelled reservation will be lower.

- No-reservation line on the day
    - Pokemon Cafe has a "no reservation" waiting line for same-day walk-in customers. If you are patient and would have time to wait, you may get lucky and be seated with your group. Tables get freed up last minutes for no-show or late customers. (This hasn't been tested; if you've had success with this method in Japan, please add an issue.)

## Acknowledgments/致谢🙏

[reserve-pokemon-cafe](https://github.com/asdofe/reserve-pokemon-cafe) -  This project is based on asdofe's project. Thanks to him for his ideas and codebase.

[All the pokemon cafe reservation tips gathered](https://www.reddit.com/r/JapanTravelTips/comments/1dr614w/all_the_pokemon_cafe_reservation_tips_gathered/) - Reddit's guide to making Pokemon cafe reservations.

Thanks to my daughter, who inspired me to write this plugin. The icon uses her favorite character, Ditto.