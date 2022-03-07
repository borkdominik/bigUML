package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

import com.eclipsesource.uml.modelserver.commands.classdiagram.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Property;

import java.util.Collection;

public class RemoveNodeCompoundCommand extends CompoundCommand {

    public RemoveNodeCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
                                     final String parentSemanticUriFragment) {
        this.append(new RemoveNodeCommand(domain, modelUri, semanticUriFragment, parentSemanticUriFragment));
        this.append(new RemoveNodeShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Node nodeToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Node.class);
    }
}
