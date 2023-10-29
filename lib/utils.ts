import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOS() {
  var os = "Unknown OS";
  try{
    var userAgent = window.navigator.userAgent
    if (userAgent.indexOf("Windows") != -1) {
        os = "Windows";
    } else if (userAgent.indexOf("Mac OS") != -1) {
        os = "MacOS";
    } else if (userAgent.indexOf("Linux") != -1) {
        os = "Linux";
    } else {
        os = "Unknown OS";
    }
  } catch (error){
    console.log(error)
  } finally {
    return os;
  }
}