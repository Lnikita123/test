import { useRouter } from "next/router";
export const displayLevelImage = (label: string) => {
  switch (label) {
    case "250":
      return <img src="/level1.png" alt="level1" />;

    case "1000":
      return <img src="/level2.png" alt="level2" />;

    case "1600":
      return <img src="/level3.png" alt="level3" />;

    case "2000":
      return <img src="/level4.png" alt="level4" />;

    case "2600":
      return <img src="/level5.png" alt="level5" />;
  }
};
export const formateTimer = (timer: number) => {
  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;
  const formatterMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formatterSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${formatterMinutes}:${formatterSeconds}`;
};
export const getSkillSet = (label: string) => {
  switch (label) {
    case "250":
      return 0;

    case "1000":
      return 5;

    case "1600":
      return 10;

    case "2000":
      return 15;

    case "2600":
      return 20;
  }
};
import { Howl } from "howler";
import move from "@/components/assets/move.mp3";
import kill from "@/components/assets/kill.mp3";
import correct from "@/components/assets/correct.mp3";
import incorrect from "@/components/assets/incorrect.mp3";
import scoreboard from "@/components/assets/scoreboard.mp3";
import reveal from "@/components/assets/reveal.mp3";
export function playSound() {
  var sound = new Howl({
    src: move,
  });

  sound.play();
}
export function killSound() {
  var sound = new Howl({
    src: kill,
  });

  sound.play();
}
export function correctSound() {
  var sound = new Howl({
    src: correct,
  });
  sound.play();
}
export function incorrectSound() {
  var sound = new Howl({
    src: incorrect,
  });
  sound.play();
}
export function scoreboardSound() {
  var sound = new Howl({
    src: scoreboard,
  });
  sound.play();
}
export function revealSound() {
  var sound = new Howl({
    src: reveal,
  });
  sound.play();
}
// export const GoFullscreen = () => {
//   if (document.documentElement.requestFullscreen) {
//     document.documentElement.requestFullscreen().then(() => {
//       document.documentElement.classList.add(
//         "flex",
//         "items-center",
//         "justify-center"
//       );
//     });
//   }
// };
export const GoFullscreen = () => {
  const pageboard = document.getElementById("pageboard");
  const puzzle = document.getElementById("puzzle");
  if (pageboard && pageboard.requestFullscreen) {
    pageboard.requestFullscreen().then(() => {
      pageboard.classList.add(
        "flex",
        "flex-col",
        "items-center",
        "justify-center"
      );
    });
  }
  if (puzzle && puzzle.requestFullscreen) {
    puzzle.requestFullscreen().then(() => {
      puzzle.classList.add(
        "bg-white",
        "flex",
        "flex-col",
        "items-center",
        "justify-center"
      );
    });
  }
};
export const ExitFullscreen = () => {
  const pageboard = document.getElementById("pageboard");
  if (!pageboard) return;
  if (document.exitFullscreen) {
    document.exitFullscreen().then(() => {
      pageboard.classList.remove(
        "bg-white",
        "flex",
        "flex-col",
        "items-center",
        "justify-center"
      );
    });
  }
};
