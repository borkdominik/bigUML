package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component;

import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.RemoveComponentCommand;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.RemoveComponentShapeCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;

public class RemoveComponentCompoundCommand extends CompoundCommand {

   public RemoveComponentCompoundCommand(final EditingDomain domain, final URI modelUri,
                                         final String semanticUriFragment) {

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Component componentToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Component.class);
      
      this.append(new RemoveComponentCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveComponentShapeCommand(domain, modelUri, semanticUriFragment));
   }
}
