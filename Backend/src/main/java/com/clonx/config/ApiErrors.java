package com.clonx.config;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
 import java.util.Map;
@RestControllerAdvice public class ApiErrors {
 @ExceptionHandler(ResponseStatusException.class) ResponseEntity<Map<String,String>> status(ResponseStatusException e){return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Solicitud inválida":e.getReason()));}
 @ExceptionHandler(Exception.class) ResponseEntity<Map<String,String>> error(Exception e){return ResponseEntity.status(500).body(Map.of("message","Ocurrió un error interno."));}
}