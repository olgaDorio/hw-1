interface EventInterface {
  size?: string;
  description: string;
  data: EventData;
  icon?: string;
  title: string;
  source: string;
  time: string;
  type?: string;
}

interface EventData {
  volume: string;
  albumcover: string;
  artist: string;
  track: {
    length: string,
  };
  temperature: Number;
  humidity: Number;
  buttons?: [string, string];
  type?: string;
  image?: string;
}
