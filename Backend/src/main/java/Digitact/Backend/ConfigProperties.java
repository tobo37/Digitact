package Digitact.Backend;

import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigProperties {
    public static final int serverPort = 9090;
    public static final String absoluteFileSystemPath = "\\\\X:XXXX";
    public static final String BLOCKFORMAT = ".txt";
    public static final long BLOCKSIZE = 1024 * 1024; // 1 MiB
    public static final int Max_Repetition_Try = 5;
    // test configurations
    public static boolean testEnvironment = false; // it will be dynamically set by the test classes
    public static String testAbsoluteFileSystemPath =
            "xx\\xx\\"; // it will be dynamically set by the test classes
}
