package edu.wgu.d387_sample_code.controller;

import edu.wgu.d387_sample_code.service.TimeZoneConversion;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class TimeZoneController {


    @GetMapping("/presentation")
    public String getPresentationTime() {

        String timeInfo = TimeZoneConversion.getPresentationTime();


        System.out.println("Presentation time requested: " + timeInfo);


        return timeInfo;
    }
}
