package edu.wgu.d387_sample_code.service;

import java.util.Locale;
import java.util.ResourceBundle;


public class DisplayMessage implements Runnable {

    private final Locale locale;
    private String message;
    private long completionTime;


    public DisplayMessage(Locale locale) {
        this.locale = locale;
    }


    @Override
    public void run() {
        try {

            Thread.sleep((long) (Math.random() * 50));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }


        ResourceBundle bundle = ResourceBundle.getBundle("messages", locale);


        this.message = bundle.getString("welcome");


        this.completionTime = System.nanoTime();


        System.out.println("[Thread: " + Thread.currentThread().getName() + "] " + message);
    }


    public String getMessage() {
        return message;
    }


    public long getCompletionTime() {
        return completionTime;
    }
}