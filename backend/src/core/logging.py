import logging

# Create a custom logger
logger = logging.getLogger('pdflyLogger')

# Set the default log level
logger.setLevel(logging.DEBUG)

# Create handlers
file_handler = logging.FileHandler('pdfly.log')
file_handler.setLevel(logging.DEBUG)

# Create formatters and add them to handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add handlers to the logger
logger.addHandler(file_handler)