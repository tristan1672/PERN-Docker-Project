import { TopicObject } from "../messaging/consumer";

export class EventRouter {
  static handle(topic: TopicObject, payload: string) {
    switch (topic.category) {
      case "color":
        if (topic.type === "*" && topic.color === "*") {
          console.log(
            `[Color Updated] Type: ${topic.type}, New Color: #${payload}`
          );
        } else {
          console.log(`[Color Updated] New Color: #${payload}`);
        }
        break;
      case "shape":
        console.log(`[Shape Updated] Type: ${payload}`);
        break;
      default:
        console.log(`[Unhandled Category]`, topic, payload);
    }
  }
}

//scene.shape.updated.*.*

//scene.color.updated.*.*

//scene.shape.updated.cube.FFFF00
