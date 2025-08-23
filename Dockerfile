FROM node:18-alpine

# Accept build-time arguments
ARG MONGO_URI
ARG RAZORPAY_KEY_ID
ARG RAZORPAY_KEY_SECRET
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG TOKEN_SECRET

# Set them as environment variables (also available at runtime)
ENV MONGO_URI=$MONGO_URI
ENV RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
ENV RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV TOKEN_SECRET=$TOKEN_SECRET

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of app
COPY . .

# Build Next.js (envs available here too)
RUN npm run build

EXPOSE 3000

# Start app with runtime envs
CMD ["npm", "run", "start"]
