package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class AddGeneralizationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:add_generalization";
   public static final String GENERAL_CLASS_ELEMENT_ID = "general_class_semantic_element_id";
   public static final String SPECIFIC_CLASS_ELEMENT_ID = "specific_class_semantic_element_id";

   public static CCompoundCommand create(final Classifier general, final Classifier specific) {
      var command = CCommandFactory.eINSTANCE.createCompoundCommand();

      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SOURCE_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(general));
      command.getProperties().put(SemanticKeys.TARGET_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(specific));

      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var context = ModelContext.of(modelUri, domain);
      var elementAccessor = new SemanticElementAccessor(context);

      var sourceSemanticElementId = command.getProperties().get(SemanticKeys.SOURCE_SEMANTIC_ELEMENT_ID);
      var source = elementAccessor.getElement(sourceSemanticElementId, Classifier.class);

      var targetSemanticElementId = command.getProperties().get(SemanticKeys.TARGET_SEMANTIC_ELEMENT_ID);
      var target = elementAccessor.getElement(targetSemanticElementId, Classifier.class);

      if (source.isPresent() && target.isPresent()) {
         return new AddGeneralizationCompoundCommand(context, source.get(), target.get());
      }

      return new NoopCommand();
   }

}
