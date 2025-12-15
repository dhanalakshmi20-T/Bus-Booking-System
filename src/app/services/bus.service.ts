import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor() { }

  private buses: any[] = [
    {
      id: 1,
      busImage: "https://pondicherrytourstravels.com/images/fleets/detail/volvo-ac-bus.webp",
      busName: "Volvo Express",
      busNumber: "AP21AA1234",
      from: "Hyderabad",
      to: "Bangalore",
      date: "2025-12-20",
      departure: "08:00",
      arrival: "14:00",
      price: 900,
      seats: 40
    },
    {
      id: 2,
      busImage: "https://www.orangetravels.in/OrangeTravels/gallery/images/site/Orange%20Tours%20&%20Travels%20109.jpg",
      busName: "Orange Travels",
      busNumber: "TS09BB9999",
      from: "Vijayawada",
      to: "Chennai",
      date: "2025-12-21",
      departure: "06:00",
      arrival: "11:30",
      price: 750,
      seats: 45
    },
    {
      id: 3,
      busImage: "https://pbs.twimg.com/media/FVDzgIdWAAA8KBs.jpg",
      busName: "Royal Luxury Volvo",
      busNumber: "KA01MM5678",
      from: "Bangalore",
      to: "Hyderabad",
      date: "2025-12-21",
      departure: "21:00",
      arrival: "06:30",
      price: 1350,
      seats: 44
    },
    {
      id: 4,
      busImage: "https://img.cdn.itspl.net/cdn/B2C_RT/VRL/NewDesignImage/images/bus_photo_01.jpg?d=1.0.0.4",
      busName: "VRL Multi-Axle Volvo",
      busNumber: "KA25TT9087",
      from: "Hubli",
      to: "Bangalore",
      date: "2025-12-22",
      departure: "22:15",
      arrival: "05:45",
      price: 1100,
      seats: 49
    },
    {
      id: 5,
      busImage: "https://s3-ap-southeast-1.amazonaws.com/rbplus/BusImage/Domestic/8674_411_5.png",
      busName: "Srinath Non-AC Seater",
      busNumber: "RJ14DD9090",
      from: "Jaipur",
      to: "Delhi",
      date: "2025-12-20",
      departure: "07:00",
      arrival: "12:30",
      price: 550,
      seats: 50
    },
    {
      id: 6,
      busImage: "https://mysuruinfrahub.com/wp-content/uploads/2024/02/sugamabus32802367267527594805.jpg",
      busName: "Sugam Sleeper Coach",
      busNumber: "MH12EE2222",
      from: "Mumbai",
      to: "Pune",
      date: "2025-12-19",
      departure: "18:00",
      arrival: "20:30",
      price: 450,
      seats: 30
    },
    {
      id: 7,
      busImage: "https://content.jdmagicbox.com/v2/comp/mumbai/r8/022pxx22.xx22.150307180400.m1r8/catalogue/neeta-volvo-bus-parcel-and-cargo-services-vile-parle-east-mumbai-parcel-booking-services-4eb6syn.jpg",
      busName: "Neeta Volvo Multi-Axle",
      busNumber: "MH04FF7865",
      from: "Mumbai",
      to: "Goa",
      date: "2025-12-23",
      departure: "20:00",
      arrival: "06:00",
      price: 1500,
      seats: 44
    },
    {
      id: 8,
      busImage: "https://content3.jdmagicbox.com/v2/comp/bangalore/h1/080pxx80.xx80.121121170349.f7h1/catalogue/sree-kaleswari-travels-pvt-ltd-madiwala-bangalore-travel-agents-21bhuc4.jpg",
      busName: "Kaleswari Deluxe",
      busNumber: "TS09GG4322",
      from: "Hyderabad",
      to: "Karimnagar",
      date: "2025-12-18",
      departure: "05:30",
      arrival: "08:15",
      price: 400,
      seats: 48
    },
    {
      id: 9,
      busImage: "https://i0.wp.com/tnstcblog.com/wp-content/uploads/2019/01/Evacay-Bharat-Benz-AC-Sleeper-Chennai-Coimbatore-Exterior-Images.jpg?resize=1400%2C480",
      busName: "Eva Travels AC Sleeper",
      busNumber: "KA05HH3456",
      from: "Bangalore",
      to: "Mysore",
      date: "2025-12-18",
      departure: "07:15",
      arrival: "10:00",
      price: 550,
      seats: 36
    },
    {
      id: 10,
      busImage: "https://content.jdmagicbox.com/comp/madurai/e7/0452px452.x452.221023203229.r1e7/catalogue/parveen-travels-madurai-travel-agents-8e3Dnzh7k6.jpg",
      busName: "Parveen Luxury Coach",
      busNumber: "TN01JJ7890",
      from: "Chennai",
      to: "Madurai",
      date: "2025-12-22",
      departure: "09:00",
      arrival: "14:30",
      price: 800,
      seats: 42
    },
    {
      id: 11,
      busImage: "https://content.jdmagicbox.com/v2/comp/bangalore/d2/080pxx80.xx80.131218101606.g5d2/catalogue/srs-travels-electronic-city-phase-1-bangalore-car-hire-2evr9k7.jpg",
      busName: "SRS Travels Volvo AC",
      busNumber: "KA03LL4455",
      from: "Bangalore",
      to: "Chennai",
      date: "2025-12-23",
      departure: "23:00",
      arrival: "05:30",
      price: 950,
      seats: 46
    },
    {
      id: 12,
      busImage: "https://s1.rdbuz.com/bo-images/IND/WM/102/983/FR/ML/webp/96pPuw.webp",
      busName: "KPN AC Seater",
      busNumber: "TN63PP7890",
      from: "Madurai",
      to: "Coimbatore",
      date: "2025-12-19",
      departure: "14:00",
      arrival: "18:30",
      price: 700,
      seats: 40
    }

  ];

  getBuses() {
    return of(this.buses)
  }

  addBus(bus: any) {
    this.buses.push(bus);
    return "Bus Added Successfully"
  }
}
