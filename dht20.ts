/**
* dht20 makecode extension based on PlanetX sensor by ELECFREAKS Co.,Ltd.
*/
//% color=#2159b2 icon="\uf2c9" block="DHT20" blockId="DHT20_"

namespace DHT20 {

    let DHT20_Addr = 0x38
    let DHT20WriteBuff = pins.createBuffer(3);
    let DHT20ReadBuff = pins.createBuffer(6);


    export enum DHT20_state {
        //% block="temperature(℃)" enumval=0
        DHT20_temperature_C,

        //% block="humidity(0~100) %" enumval=1
        DHT20_humidity,
    }


    //% blockId="readdht20" block="DHT20 sensor %dht20state value"
    //% dht20state.fieldEditor="gridpicker"
    //% dht20state.fieldOptions.columns=1

    export function dht20Sensor(dht20state: DHT20_state): number {
        let temp, temp1, rawData = 0;
        let temperature, humidity = 0;
        DHT20WriteBuff[0] = 0xAC;
        DHT20WriteBuff[1] = 0x33;
        DHT20WriteBuff[2] = 0x00;
        pins.i2cWriteBuffer(DHT20_Addr, DHT20WriteBuff);
        basic.pause(80)
        DHT20ReadBuff = pins.i2cReadBuffer(DHT20_Addr, 6)

        rawData = 0;
        if (dht20state == DHT20_state.DHT20_temperature_C) {
            temp = DHT20ReadBuff[3] & 0xff;
            temp1 = DHT20ReadBuff[4] & 0xff;
            rawData = ((temp & 0xf) << 16) + (temp1 << 8) + (DHT20ReadBuff[5]);
            temperature = rawData / 5242 - 50;
            temperature = temperature * 100
            return Math.round(temperature) / 100;
        }
        else {
            temp = DHT20ReadBuff[1] & 0xff;
            temp1 = DHT20ReadBuff[2] & 0xff;
            rawData = (temp << 12) + (temp1 << 4) + ((DHT20ReadBuff[3] & 0xf0) >> 4);
            humidity = rawData / 0x100000;
            humidity = humidity * 10000
            return Math.round(humidity) / 100;
        }
    }

}