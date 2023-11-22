from telegram import Bot
from telegram.constants import ParseMode
from .models import Order

async def send_order_to_telegram(order):
    # Replace 'your_bot_token' with your actual Telegram bot token
    bot_token = '6593345007:AAFkEZnGwUWWvFX1g6K72lAY4PjQd6c5Q6I'

    # Replace 'your_chat_id' with your actual Telegram chat ID
    chat_id = '1494087225'

    # Initialize the Telegram bot
    bot = Bot(token=bot_token)

    # Compose the message with order details
    message = f"New Order:\n\n" \
              f"Product: {order.product.title}\n" \
              f"Name: {order.name}\n" \
              f"Surname: {order.surname}\n" \
              f"Phone Number: {order.phone_number}"

    # Send the message to Telegram
    try:
        print("Sending Telegram message...")
        await bot.send_message(chat_id=chat_id, text=message, parse_mode=ParseMode.MARKDOWN)
        print("Telegram message sent successfully!")
    except Exception as e:
        print(f"Error sending Telegram message: {e}")


if __name__ == "__main__":
    import asyncio

    # This is just an example to test the script.
    # You should call this function with the order data after creating an order.

    # Create an Order instance with the example data
    example_order_data = {
        "product": {"title": "Product Name"},
        "name": "John",
        "surname": "Doe",
        "phone_number": "+1234567890"
    }
    example_order = Order(**example_order_data)

    # Call the function to send the order to Telegram
    asyncio.run(send_order_to_telegram(example_order))
