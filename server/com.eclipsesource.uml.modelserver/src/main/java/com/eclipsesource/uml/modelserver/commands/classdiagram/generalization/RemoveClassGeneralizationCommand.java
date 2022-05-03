package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

public class RemoveClassGeneralizationCommand extends UmlSemanticElementCommand {

   protected final String semanticUriFragment;

   public RemoveClassGeneralizationCommand(final EditingDomain domain, final URI modelUri,
                                           final String semanticUriFragment) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
   }

   @Override
   protected void doExecute() {
      Generalization generalizationToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
            Generalization.class);
      umlModel.getPackagedElements().remove(generalizationToRemove);
   }
}
