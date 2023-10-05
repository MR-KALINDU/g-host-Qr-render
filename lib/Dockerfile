FROM quay.io/vorterx/vorterx:latest
RUN git clone https://github.com/D3centX/Aztec-Qr /root/vorterx
WORKDIR /root/vorterx/
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
