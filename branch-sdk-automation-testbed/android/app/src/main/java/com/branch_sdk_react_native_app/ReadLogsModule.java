package io.branch.saas.sdk.testbed;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import android.util.Log;

public class ReadLogsModule extends ReactContextBaseJavaModule {
    ReadLogsModule(ReactApplicationContext context) {
       super(context);
   }
   @Override
   public String getName() {
     return "ReadLogs";
   }
    @ReactMethod
    public void readLog(Callback cb) {
        Process process = null;
        try {
            process = Runtime.getRuntime().exec("logcat -d");
        } catch (IOException e) {
            e.printStackTrace();
        }
        ArrayList<String> dataList = printResults(process);
        StringBuilder dataStr = new StringBuilder();
        for (String s : dataList) {
            System.out.println("data-->" + s);
            if (s.contains("BranchSDK") || s.contains("BRANCH SDK")) {
                if (s.contains("posting to") || s.contains("track user")
                        || s.contains("Post value") || s.contains("returned")
                        || s.contains("sessionParams") || s.contains("installParams")) {
                    System.out.println("data if-->" + s);
                    dataStr.append(s);
                    dataStr.append("\n\n");
                }
            }
        }
        cb.invoke(dataStr.toString());
    }
    @ReactMethod
    public String clearLogs() {
        try {
            Runtime.getRuntime().exec("logcat -c");
        } catch (IOException e) {
            e.printStackTrace();
        }
        // try {
        //     Process process = new ProcessBuilder().command("logcat", "-c").redirectErrorStream(true).start();
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }
        return "";
    }
    @ReactMethod
    public String createLogFile() {
        return "";
    }
    private ArrayList<String> printResults(Process process) {

        ArrayList<String> lineString = new ArrayList<>();
        String line;
        try {
            BufferedReader stdOut = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            // read the output from the command
            while ((line = stdOut.readLine()) != null) {
                lineString.add(line);
            }

            // read any errors from the attempted command
            while ((line = stdError.readLine()) != null) {
                lineString.add(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lineString;
    }
}