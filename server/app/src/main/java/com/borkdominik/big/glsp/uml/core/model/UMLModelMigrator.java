package com.borkdominik.big.glsp.uml.core.model;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.glsp.server.features.core.model.RequestModelAction;
import org.eclipse.glsp.server.types.GLSPServerException;

public class UMLModelMigrator {
    public void migrateNotationModel(ResourceSet resourceSet, URI sourceURI, RequestModelAction action) {
        try {
            var filePath = sourceURI.toFileString();
            var content = new String(Files.readAllBytes(Paths.get(filePath)), StandardCharsets.UTF_8);

            if (content.indexOf("unotation:UmlDiagram") >= 0) {
                content = content.replace("xmlns:unotation=\"http://www.eclipsesource.com/glsp/uml/unotation\"",
                        "xmlns:unotation=\"http://www.borkdominik.com/big-glsp/uml/unotation\"");
                content = content.replace("<unotation:UmlDiagram", "<unotation:UMLDiagram");
                content = content.replace("</unotation:UmlDiagram>", "</unotation:UMLDiagram>");

                Files.write(Paths.get(filePath), content.getBytes(StandardCharsets.UTF_8));
            }
        } catch (IOException e) {
            throw new GLSPServerException("Failed to update the notation model file", e);
        }
    }
}
