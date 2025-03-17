package com.example.hw;


import com.example.hw.dao.request.SignUpRequest;
import com.example.hw.repository.DirectoryRepository;
import com.example.hw.repository.RecordRepository;
import com.example.hw.repository.ShareTokenRepository;
import com.example.hw.repository.UserRepository;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.hamcrest.CoreMatchers.*;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.MatcherAssert.assertThat;

@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class})
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class HomeWorkTests {
    @Autowired
    private TestRestTemplate restTemplate;

    @MockBean
    private ShareTokenRepository shareTokenRepository;
    @MockBean
    private RecordRepository recordRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DirectoryRepository directoryRepository;


    @Test
    public void UserCanSignUp() {
        var request = new SignUpRequest("Slava", "kirnes", "qwerty");
        var response = restTemplate.postForEntity("/auth/signup", request, JSONObject.class);
        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }

//    @Test
//    public void whenCreateRecord_thenStatus201() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        CreateRecordDTO recordDTO = new CreateRecordDTO
//                ("Kirill", "kirnes", "qwerty", "www.kir.com");
//        ResponseEntity<?> response = restTemplate.postForEntity("/records", recordDTO, CreateRecordDTO.class);
//
//        assertThat(response.getStatusCode(), is(HttpStatus.CREATED));
//    }
//
//    @Test
//    public void whenUpdateRecord_thenStatus200() {
//
//        CreateTestRecord(0, "Kirill", "kirnes", "qwerty", "www.kir.com");
//        Record record = new Record(0, "newKIRILL", "kirnes", "qwertyNEW", "www.kir.com", 0);
//        HttpEntity<Record> entity = new HttpEntity<Record>(record);
//        ResponseEntity<Record> response = restTemplate.exchange
//                ("/records/{recordId}", HttpMethod.PUT, entity, Record.class, 0);
//        assertThat(response.getStatusCode(), is(HttpStatus.OK));
//    }
//
//    @Test
//    public void givenRecord_whenGetRecord_thanStatus200() {
//        CreateTestRecord(0, "Kirill", "kirnes", "qwerty", "www.kir.com");
//        Record record = restTemplate.getForObject("/records/{recordId}", Record.class, 0);
//        assertThat(record.getName(), is("Kirill"));
//    }
//
//    @Test
//    public void givenPersons_whenGetPersons_thanStatus200() {
//        CreateTestRecord(0, "Kirill", "kirnes", "qwerty", "www.kir.com");
//        CreateTestRecord(1, "Anton", "antoha", "qwe123", "www.ant.com");
//        var response = restTemplate.getForEntity("/records", RecordDTO[].class);
//        var records = response.getBody();
//        assertThat(records.length, is(2));
//        assertThat(records[1].getName(), is("Anton"));
//    }
//
//    private void CreateTestRecord(Integer id, String name, String login, String password, String url) {
//        recordRepository.save(new Record(id, name, login, password, url, 0));
//    }
//
//    @Test
//    public void whenCreateBadRecord_thenStatus400() {
//        CreateRecordDTO recordDTO = new CreateRecordDTO
//                ("Kirill", "kirnes", null, "www.kir.com");
//        var statusCode = (restTemplate.postForEntity("/records", recordDTO, String.class).getStatusCode());
//
//        assertThat(statusCode, is(HttpStatus.BAD_REQUEST));
//    }
}
