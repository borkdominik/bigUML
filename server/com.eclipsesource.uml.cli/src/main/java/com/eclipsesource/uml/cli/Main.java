package com.eclipsesource.uml.cli;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

import com.eclipsesource.uml.glsp.UmlGLSPServerLauncher;
import com.eclipsesource.uml.modelserver.UmlModelServerLauncher;

public class Main {
	private static String Name = "cli";
	private static String GLSPServerCommand = "glspserver";
	private static String ModelServerCommand = "modelserver";
	
	private static void help() {
		System.out.println(String.format("usage: %s <argument> [<args>]", Name));
		System.out.println();
		System.out.println(String.format("  %s\t%s", GLSPServerCommand, "Start the GLSP server"));
		System.out.println(String.format("  %s\t%s", ModelServerCommand, "Start the Model server"));
	}
	
	private static void parseGLSPServerCommand(DefaultParser parser, String[] args) throws ParseException {
		UmlGLSPServerLauncher.main(args);
	}

	private static void parseModelServerCommand(DefaultParser parser, String[] args) throws ParseException {
		UmlModelServerLauncher.main(args);
	}
	
	public static void main(String[] args) {
		if (args.length == 0) {
			help();
			return;
		}

		var parser = new DefaultParser();
		try {
			var command = args[0];
			var commandArgs = new String[0];
			if (args.length > 1) {
				commandArgs = Arrays.copyOfRange(args, 1, args.length);	
			}

			if (command.equals(GLSPServerCommand)) {
				parseGLSPServerCommand(parser, commandArgs);
			} else if (command.equals(ModelServerCommand)) {
				parseModelServerCommand(parser, commandArgs);
			} else {
				System.err.print("Unrecognized command: " + command);
				return;	
			}
		} catch (ParseException e) {
			System.err.println("Parsing failed. Reason: " + e.getMessage());
		}

	}

}
