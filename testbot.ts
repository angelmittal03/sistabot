import { WebClient, RTMClient } from '@slack/client';

// Initialize the Slack API clients
const webClient = new WebClient(process.env.SLACK_TOKEN);
const rtmClient = new RTMClient(process.env.SLACK_TOKEN);


rtmClient.start();

// Listening for the message event
rtmClient.on('message', async (event) => {
  try {
    // keyword check
    if (event.text.includes('sista')) {
      // response
      await webClient.chat.postMessage({
        channel: event.channel,
        text: 'yes, what do you need? you can :set reminder for <timeInHours>:to get a tagged reminder',
      });
    } else if (event.text.includes('set reminder for')) {
        const numbers = event.text.replace(/\D/g, '');
        const time = numbers;
      // response
      await webClient.chat.postMessage({
        channel: event.channel,
        text: scheduleReminder(<@${message.user}>, event.channel, "Don't forget the meeting!",(3600*time))
      });
    } 
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

async function scheduleReminder(userId: string, channelId: string, text: string, reminderTime: number) {
    try {
      // Calculate the timestamp for the reminder
      const reminderTimestamp = Math.floor(Date.now() / 1000) + reminderTime;
  
      // Schedule the reminder message
      const response = await webClient.chat.scheduleMessage({
        channel: channelId,
        text: `<@${userId}> ${text}`, // Tag the user in the reminder message
        post_at: reminderTimestamp.toString(),
      });
  
      console.log('Reminder scheduled successfully:', response);
    } catch (error) {
      console.error('Error occurred while scheduling the reminder:', error);
    }
  }