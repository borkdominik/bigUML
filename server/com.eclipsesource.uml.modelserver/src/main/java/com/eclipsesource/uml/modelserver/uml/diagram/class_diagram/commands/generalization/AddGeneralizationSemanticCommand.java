package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class AddGeneralizationSemanticCommand extends UmlSemanticElementCommand {

   protected Generalization newGeneralization;
   protected final Classifier general;
   protected final Classifier specific;

   public AddGeneralizationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Classifier specific, final Classifier general) {
      super(domain, modelUri);
      this.general = general;
      this.specific = specific;
   }

   @Override
   protected void doExecute() {
      this.newGeneralization = specific.createGeneralization(general);
   }

   public Generalization getNewGeneralization() { return newGeneralization; }

}
