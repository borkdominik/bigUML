package com.borkdominik.big.glsp.uml.core.model;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.glsp.server.features.core.model.RequestModelAction;
import org.eclipse.glsp.server.types.GLSPServerException;

public class UMLModelMigrator {
    public void migrateNotationModel(ResourceSet resourceSet, URI sourceURI, RequestModelAction action) {
        try {
            var javaUri = new java.net.URI(sourceURI.scheme(), sourceURI.authority(), sourceURI.path(), sourceURI.query(), sourceURI.fragment());
            var filePath = Paths.get(javaUri);
            var content = Files.readString(filePath);

            if (content.contains("unotation:UmlDiagram")) {
                content = content.replace("xmlns:unotation=\"http://www.eclipsesource.com/glsp/uml/unotation\"",
                        "xmlns:unotation=\"http://www.borkdominik.com/big-glsp/uml/unotation\"");
                content = content.replace("<unotation:UmlDiagram", "<unotation:UMLDiagram");
                content = content.replace("</unotation:UmlDiagram>", "</unotation:UMLDiagram>");
                content = content.replaceAll("representation=\"(\\w+)\"", "");

                Files.writeString(filePath, content);
            }
        } catch (IOException|URISyntaxException e) {
            throw new GLSPServerException("Failed to update the notation model file", e);
        }
    }
}
