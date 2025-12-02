package edu.wgu.d387_sample_code.controller;

import edu.wgu.d387_sample_code.service.DisplayMessage;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class WelcomeController {


    @GetMapping("/welcome")
    public List<String> getWelcome() {


        DisplayMessage englishTask = new DisplayMessage(Locale.US);
        DisplayMessage frenchTask = new DisplayMessage(Locale.CANADA_FRENCH);


        List<DisplayMessage> tasks = new ArrayList<>();
        tasks.add(englishTask);
        tasks.add(frenchTask);


        Thread englishThread = new Thread(englishTask, "English-Thread");
        Thread frenchThread = new Thread(frenchTask, "French-Thread");


        englishThread.start();
        frenchThread.start();

        try {

            englishThread.join();
            frenchThread.join();
        } catch (InterruptedException e) {
            System.err.println("Thread interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }


        tasks.sort(Comparator.comparingLong(DisplayMessage::getCompletionTime));


        List<String> messages = new ArrayList<>();
        for (DisplayMessage task : tasks) {
            messages.add(task.getMessage());
        }


        System.out.println("Returning messages in order: " + messages);


        return messages;
    }
}