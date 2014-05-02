import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class Parser {
	public static void main(String[] args) throws IOException {
		Document doc = Jsoup.connect("http://www.lasaonline.org/apps/staff/")
				.get();
		String str = doc.html();
		String data = (str.substring(str.indexOf("var userJSON = ["),
				str.indexOf("TableSearch.init(document.getElementById")));
		PrintWriter out = new PrintWriter(new FileOutputStream("list.txt"));
		boolean next = true;
		while (next) {
			int start = data.indexOf(("\"title\":"));
			if (start < 0) {
				next = false;
			} else {
				data = data.substring(start);
				int end = data.indexOf("\",");
				String title = data.substring("\"title\":".length() + 1, end);
				title = title.substring(0, 1).toUpperCase()
						+ title.substring(1, title.length());
				String nameAndTitle = title + ".";
				nameAndTitle+=" ";
				data = data.substring(end);
				int index = data.indexOf(("\"lName\":"));
				data = data.substring(index);
				int finish = data.indexOf("\",");
				String name = data.substring("\"lName\":".length() + 1, finish);
				name = name.substring(0, 1).toUpperCase()
						+ name.substring(1, name.length());
				nameAndTitle+=name;
				out.println(nameAndTitle);
				System.out.println(nameAndTitle);
				data = data.substring(finish);
			}
		}
		out.close();
	}
}
