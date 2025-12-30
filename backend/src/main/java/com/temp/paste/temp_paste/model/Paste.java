package com.temp.paste.temp_paste.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class Paste {
    private String id;
    private String text;
    private Integer ttl ;
}
