import type {GameEvent} from './core';
// Original synthesized sound design: no remote audio, autoplay, or copyrighted samples.
export class AudioManager {
 context?:AudioContext;master?:GainNode;muted=false;volume=.35;lastCast=0;
 start(){if(!this.context){this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=this.volume;this.master.connect(this.context.destination);}void this.context.resume();}
 play(event:GameEvent){const c=this.context;if(!c||!this.master||this.muted)return;if(event.type==='cast'&&c.currentTime-this.lastCast<.07)return;if(event.type==='cast')this.lastCast=c.currentTime;
  const profiles:Record<string,[number,OscillatorType]>={fire:[95,'sawtooth'],frost:[850,'sine'],lightning:[220,'square'],stone:[55,'triangle'],wind:[360,'sine'],toxic:[160,'sawtooth']};const [freq,type]=profiles[event.element||'wind']||profiles.wind;const duration=event.type==='phase'?.8:event.type==='warning'?.4:event.type==='combo'?.45:.13;
  const osc=c.createOscillator(),gain=c.createGain(),filter=c.createBiquadFilter();osc.type=type;osc.frequency.setValueAtTime(event.type==='warning'?480:freq,c.currentTime);osc.frequency.exponentialRampToValueAtTime(event.type==='pickup'?freq*2:Math.max(25,freq*.3),c.currentTime+duration);filter.type='lowpass';filter.frequency.value=event.element==='stone'?250:2000;gain.gain.setValueAtTime(event.type==='hit'?.12:.045,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);osc.connect(filter).connect(gain).connect(this.master);osc.start();osc.stop(c.currentTime+duration);
 }
 setVolume(value:number){this.volume=value;if(this.master)this.master.gain.value=value;}
}
